import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import TournamentRow from "../widgets/TournamentRow.svelte";

describe("TournamentRow", () => {
  const mockTournament = {
    id: "1",
    attributes: {
      name: "Test Tournament",
      date: "2024-05-23T00:00:00.000Z",
      active_player_count: 42,
      tournament_organizer: "Test Organizer",
      stream_url: "https://twitch.tv/test",
      tournament_type_id: 1,
      user_id: 10,
    },
  };

  it("renders tournament details", () => {
    const { getByText } = render(TournamentRow, {
      tournament: mockTournament,
      tournamentTypeName: "Standard",
    });

    expect(getByText("Test Tournament")).toBeDefined();
    // active_player_count
    expect(getByText(/42 active players/)).toBeDefined();
    // tournamentTypeName
    expect(getByText("Standard")).toBeDefined();
    // tournament organizer
    expect(getByText(/- Test Organizer/)).toBeDefined();
  });
});
