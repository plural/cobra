import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/svelte";
import TournamentType from "../tournaments/TournamentType.svelte";

describe("TournamentType", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: "100",
                attributes: {
                  name: "First Tournament",
                  date: "2026-05-20",
                  active_player_count: 5,
                  tournament_organizer: "tester",
                  stream_url: "",
                  tournament_type_id: 11,
                  user_id: 10,
                },
              },
              {
                id: "101",
                attributes: {
                  name: "Second Tournament",
                  date: "2026-05-21",
                  active_player_count: 1,
                  tournament_organizer: "tester2",
                  stream_url: "https://twitch.tv/example",
                  tournament_type_id: 11,
                  user_id: 42,
                },
              },
            ],
            included: [
              {
                id: "11",
                type: "tournament_types",
                attributes: {
                  name: "Standard",
                },
              },
            ],
            links: {
              prev: null,
              next: "/api/v1/public/tournaments?page[number]=2",
            },
          }),
      })
    ) as unknown as typeof fetch;
  });

  it("renders correctly with default props and fetches tournaments", async () => {
    const { getAllByText, getByText, queryByText } = render(TournamentType);

    expect(getByText("Beta Tournaments By Type")).toBeTruthy();

    expect(getAllByText("Loading...").length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/public/tournaments?page[size]=10&sort=-date,name&include=tournament_type",
        expect.any(Object)
      );
      expect(getByText("First Tournament")).toBeTruthy();
      expect(getByText("Second Tournament")).toBeTruthy();
    });

    // userId defaults to -1, so no delete options should render
    expect(queryByText("Delete")).toBeNull();
  });

  it("renders correctly with specific typeId and user info", async () => {
    const { getByText, getByRole } = render(TournamentType, {
      props: {
        typeId: "11",
        userId: 42,
        userName: "tester_pro",
      },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/public/tournaments?page[size]=10&filter[tournament_type_id]=11&sort=-date,name&include=tournament_type",
        expect.any(Object)
      );
      expect(getByText("Second Tournament")).toBeTruthy();
    });

    // userId evaluates to 42, which matches Second Tournament but not First Tournament
    const deleteButtons = getByRole("link", { name: /Delete/i });
    expect(deleteButtons).toBeTruthy();
  });

  it("loads next page when API provides a next link", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: "100",
                attributes: {
                  name: "First Tournament",
                  date: "2026-05-20",
                  active_player_count: 5,
                  tournament_organizer: "tester",
                  stream_url: "",
                  tournament_type_id: 11,
                  user_id: 10,
                },
              },
            ],
            included: [
              {
                id: "11",
                type: "tournament_types",
                attributes: {
                  name: "Standard",
                },
              },
            ],
            links: {
              prev: null,
              next: "/api/v1/public/tournaments?page[number]=2",
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: "200",
                attributes: {
                  name: "Third Tournament",
                  date: "2026-05-22",
                  active_player_count: 9,
                  tournament_organizer: "tester3",
                  stream_url: "",
                  tournament_type_id: 11,
                  user_id: 10,
                },
              },
            ],
            included: [
              {
                id: "11",
                type: "tournament_types",
                attributes: {
                  name: "Standard",
                },
              },
            ],
            links: {
              prev: "/api/v1/public/tournaments?page[number]=1",
              next: null,
            },
          }),
      }) as unknown as typeof fetch;

    const { getAllByRole, getByText, queryByText } = render(TournamentType, {
      props: {
        typeId: "11",
      },
    });

    await waitFor(() => {
      expect(getByText("First Tournament")).toBeTruthy();
    });

    const nextButtons = getAllByRole("button", { name: /Next/i });
    await fireEvent.click(nextButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "/api/v1/public/tournaments?page[number]=2",
        expect.any(Object)
      );
      expect(getByText("Third Tournament")).toBeTruthy();
      expect(queryByText("First Tournament")).toBeNull();
    });
  });

  it("keeps current results visible while next page is loading", async () => {
    let resolveSecondFetch:
      | ((value: { ok: boolean; json: () => Promise<unknown> }) => void)
      | undefined;

    const secondFetchPromise = new Promise<{
      ok: boolean;
      json: () => Promise<unknown>;
    }>((resolve) => {
      resolveSecondFetch = resolve;
    });

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: "100",
                attributes: {
                  name: "First Tournament",
                  date: "2026-05-20",
                  active_player_count: 5,
                  tournament_organizer: "tester",
                  stream_url: "",
                  tournament_type_id: 11,
                  user_id: 10,
                },
              },
            ],
            included: [
              {
                id: "11",
                type: "tournament_types",
                attributes: {
                  name: "Standard",
                },
              },
            ],
            links: {
              prev: null,
              next: "/api/v1/public/tournaments?page[number]=2",
            },
          }),
      })
      .mockImplementationOnce(
        () => secondFetchPromise as unknown as ReturnType<typeof fetch>
      );

    const { getAllByRole, getAllByText, getByText } = render(TournamentType, {
      props: {
        typeId: "11",
      },
    });

    await waitFor(() => {
      expect(getByText("First Tournament")).toBeTruthy();
    });

    const nextButtons = getAllByRole("button", { name: /Next/i });
    await fireEvent.click(nextButtons[0]);

    await waitFor(() => {
      expect(getByText("First Tournament")).toBeTruthy();
      expect(getAllByText("Loading...").length).toBeGreaterThan(0);
      expect(nextButtons[0]).toBeDisabled();
    });

    resolveSecondFetch?.({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [
            {
              id: "200",
              attributes: {
                name: "Third Tournament",
                date: "2026-05-22",
                active_player_count: 9,
                tournament_organizer: "tester3",
                stream_url: "",
                tournament_type_id: 11,
                user_id: 10,
              },
            },
          ],
          included: [
            {
              id: "11",
              type: "tournament_types",
              attributes: {
                name: "Standard",
              },
            },
          ],
          links: {
            prev: "/api/v1/public/tournaments?page[number]=1",
            next: null,
          },
        }),
    });

    await waitFor(() => {
      expect(getByText("Third Tournament")).toBeTruthy();
    });
  });
});
