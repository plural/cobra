import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/svelte";
import Tournament from "../tournaments/Tournament.svelte";
import { MockTournament } from "./TournamentTestData";
import { MockPlayerBob } from "./RoundsTestData";
import { loadPlayer, loadTournament } from "../tournaments/TournamentSettings";
import { loadIdentityNames } from "../identities/Identity";

vi.mock("../tournaments/TournamentSettings", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadTournament: vi.fn(() => MockTournament),
  loadPlayer: vi.fn(() => MockPlayerBob),
}));

vi.mock("../identities/Identity", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadIdentityNames: vi.fn(() => undefined),
}));

describe("Tournament", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("when player is logged out", () => {
    beforeEach(async () => {
      vi.spyOn(MockPlayerBob, "id", "get").mockReturnValue(0);

      render(Tournament, { tournamentId: 1, userId: -1 });

      await waitFor(() => {
        expect(loadTournament).toHaveBeenCalledOnce();
      });
      await waitFor(() => {
        expect(loadPlayer).toHaveBeenCalledOnce();
      });
      await waitFor(() => {
        expect(loadIdentityNames).toHaveBeenCalledOnce();
      });
    });

    it("displays tournament info and log in prompt", () => {
      // Tournament card
      expect(screen.getByLabelText("shortcode")).toHaveTextContent("ABC1 ( http://localhost:3000/ABC1 )");
      expect(screen.getByLabelText("date")).toHaveTextContent("Tuesday, April 21, 2026");
      expect(screen.getByLabelText("registration time")).toHaveTextContent("10:00 AM");
      expect(screen.getByLabelText("first round time")).toHaveTextContent("11:00 AM");
      expect(screen.getByLabelText("time zone")).toHaveTextContent("UTC");
      expect(screen.getByLabelText("tournament organiser")).toHaveTextContent("Alice");
      expect(screen.getByLabelText("player count")).toHaveTextContent("17 active players (1 dropped)");
      expect(screen.getByLabelText("QR Code")).toHaveTextContent("Open Printable QR Code");

      // Registration card
      expect(screen.getByLabelText("registration information")).toHaveTextContent("Sign in");
      expect(screen.getByLabelText("registration information")).toHaveTextContent("Create NRDB Account");
    });

    // TODO: When registration is closed
      // TODO: Don't display log in information
  });

  // TODO: When player is logged in
    // TODO: When player is not registered
    // TODO: When player is registered
      // TODO: Player is not dropped
      // TODO: Player is dropped
});