import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import MatchSlips from "../pairings/MatchSlips.svelte";
import { loadPairings, type Pairing } from "../pairings/PairingsData";
import { MockPairingsData, MockRound1 } from "./RoundsTestData";
import userEvent from "@testing-library/user-event";
import { Player } from "../players/PlayersData";

const user = userEvent.setup();

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPairings: vi.fn(() => MockPairingsData),
}));

describe("MatchSlips", () => {
  let mockPairings: Pairing[];

  beforeAll(() => {
    mockPairings = Array.from({ length: 8 }, (_, i) => {
      const player1 = new Player();
      player1.name_with_pronouns = `Player ${i * 2 + 1}`;
      const player2 = new Player();
      player2.name_with_pronouns = `Player ${i * 2 + 2}`;

      return {
        id: i + 1,
        table_number: i + 1,
        table_label: "",
        policy: {
          self_report: false,
        },
        player1: player1,
        player2: player2,
        score1: 0,
        score1_corp: 0,
        score1_runner: 0,
        score2: 0,
        score2_corp: 0,
        score2_runner: 0,
        score_label: "",
        intentional_draw: false,
        two_for_one: false,
        self_reports: null,
        reported: false,
        winner_game: null,
        loser_game: null,
        bracket_type: null,
        ui_metadata: {
          row_highlighted: false,
        },
      };
    });
  });

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(MockRound1, "pairings", "get").mockReturnValue(mockPairings);

    render(MatchSlips, { tournamentId: 1, roundId: 1 });
  });

  it("displays match slips", () => {
    const matchSlips = document.getElementsByClassName("match_slip");

    expect(loadPairings).toHaveBeenCalledOnce();
    for (let i = 0; i < 8; i++) {
      expect(matchSlips[i]).toHaveTextContent(`Round 1 - Table ${i + 1}`);
      expect(matchSlips[i]).toHaveTextContent(
        mockPairings[i].player1.name_with_pronouns,
      );
      expect(matchSlips[i]).toHaveTextContent(
        mockPairings[i].player2.name_with_pronouns,
      );
    }
  });

  it("displays collated match slips", async () => {
    await user.click(screen.getByRole("button", { name: /collate/i }));

    const matchSlips = document.getElementsByClassName("match_slip");

    expect(loadPairings).toHaveBeenCalledOnce();
    const collatedOrder = [0, 2, 4, 6, 1, 3, 5, 7];
    for (let i = 0; i < 8; i++) {
      const tableIndex = collatedOrder[i];
      expect(matchSlips[i]).toHaveTextContent(
        `Round 1 - Table ${tableIndex + 1}`,
      );
      expect(matchSlips[i]).toHaveTextContent(
        mockPairings[tableIndex].player1.name_with_pronouns,
      );
      expect(matchSlips[i]).toHaveTextContent(
        mockPairings[tableIndex].player2.name_with_pronouns,
      );
    }
  });
});
