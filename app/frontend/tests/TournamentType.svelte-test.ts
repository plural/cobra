import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/svelte";
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
          }),
      })
    ) as unknown as typeof fetch;
  });

  it("renders correctly with default props and fetches tournaments", async () => {
    const { getByText, queryByText } = render(TournamentType);

    expect(getByText("Beta Tournaments By Type")).toBeTruthy();
    expect(getByText("Type ID:")).toBeTruthy();
    // Default userId is -1, so user info shouldn't map.
    expect(queryByText(/User:/)).toBeNull();

    expect(getByText("Loading...")).toBeTruthy();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/public/tournaments?filter[tournament_type_id]=&sort=-date,name&include=tournament_type",
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

    expect(getByText("Type ID: 11")).toBeTruthy();
    expect(getByText("User: tester_pro (42)")).toBeTruthy();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/public/tournaments?filter[tournament_type_id]=11&sort=-date,name&include=tournament_type",
        expect.any(Object)
      );
      expect(getByText("Second Tournament")).toBeTruthy();
    });

    // userId evaluates to 42, which matches Second Tournament but not First Tournament
    const deleteButtons = getByRole("link", { name: /Delete/i });
    expect(deleteButtons).toBeTruthy();
  });
});
