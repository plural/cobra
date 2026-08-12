import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadNewDemoTournament,
  createDemoTournament,
  ValidationError,
} from "./DemoTournamentSettings";

describe("DemoTournamentSettings", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadNewDemoTournament", () => {
    it("fetches new tournament form data", async () => {
      const mockData = {
        tournament: {
          name: undefined,
          swiss_format: "single_sided",
          num_players: undefined,
          num_first_round_byes: undefined,
          assign_ids: false,
        },
        csrf_token: "mock-csrf-token",
      };

      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => mockData,
      } as unknown as Response);

      const result = await loadNewDemoTournament();
      expect(result).toEqual(mockData);
    });

    it("handles network errors", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(loadNewDemoTournament()).rejects.toThrow();
    });
  });

  describe("createDemoTournament", () => {
    it("creates a demo tournament", async () => {
      const mockResponse = {
        id: 123,
        name: "Test Demo Tournament",
        url: "/tournaments/123/rounds",
      };

      const tournament = {
        name: "Test Tournament",
        swiss_format: "single_sided",
        num_players: 8,
        num_first_round_byes: 0,
        assign_ids: false,
      };

      vi.spyOn(global, "fetch").mockImplementation((_url, init) => {
        const headers = (init?.headers ?? {}) as Record<string, string>;
        expect(headers["Content-Type"]).toBe("application/json");
        expect(headers.Accept).toBe("application/json");
        expect(headers["X-CSRF-Token"]).toBe("mock-csrf-token");
        expect(init?.body).toBe(JSON.stringify({ tournament }));

        return Promise.resolve({
          ok: true,
          json: () => mockResponse,
        } as unknown as Response);
      });

      const result = await createDemoTournament("mock-csrf-token", tournament);
      expect(result).toEqual(mockResponse);
    });

    it("handles validation errors", async () => {
      const mockErrors = {
        errors: {
          name: ["Name is required"],
          first_round_byes: ["Number of byes must be a number"],
        },
      };

      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 422,
        json: () => mockErrors,
      } as unknown as Response);

      const tournament = { name: "" };

      await expect(
        createDemoTournament("mock-csrf-token", tournament),
      ).rejects.toThrow(ValidationError);
    });

    it("handles server errors", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      const tournament = { name: "Test" };

      await expect(
        createDemoTournament("mock-csrf-token", tournament),
      ).rejects.toThrow("HTTP 500: Internal Server Error");
    });
  });
});
