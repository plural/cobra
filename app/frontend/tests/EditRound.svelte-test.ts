import { fireEvent, render, within } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditRound from "../pairings/EditRound.svelte";
import { loadRound, type RoundData } from "../pairings/RoundData";
import { deletePairing, Tournament } from "../pairings/PairingsData";
import { reportScore } from "../pairings/SelfReport";

const MockPlayer1 = {
  id: 1,
  name: "Alice",
  name_with_pronouns: "",
  side: "corp",
  user_id: null,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};
const MockPlayer2 = {
  id: 2,
  name: "Bob",
  name_with_pronouns: "",
  side: "runner",
  user_id: null,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};
const MockRoundData: RoundData = {
  tournament: new Tournament(),
  policy: { update: true, custom_table_numbering: false },
  stage: {
    id: 1,
    name: "Single Sided Swiss",
    format: "single_sided_swiss",
    is_single_sided: true,
    is_elimination: false,
    view_decks: false,
    rounds: [],
  },
  round: {
    id: 1,
    number: 1,
    completed: false,
    pairings: [
      {
        id: 1,
        table_number: 1,
        table_label: "Table 1",
        policy: {
          self_report: false,
        },
        player1: MockPlayer1,
        player2: MockPlayer2,
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
      },
    ],
    pairings_reported: 0,
    length_minutes: 0,
    timer: {
      running: false,
      paused: false,
      started: false,
    },
    unpaired_players: [],
  },
};

const user = userEvent.setup();

vi.mock("../pairings/RoundData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/RoundData")>()),
  loadRound: vi.fn(() => MockRoundData),
}));

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  deletePairing: vi.fn(() => true),
}));

vi.mock("../pairings/SelfReport", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/SelfReport")>()),
  reportScore: vi.fn(() => true),
}));

describe("EditRound", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    render(EditRound, { tournamentId: 1, roundId: 1 });
  });

  describe("delete pairings", () => {
    it("deletes a pairing", async () => {
      vi.spyOn(MockRoundData.round, "pairings", "get").mockReturnValue([]);
      vi.spyOn(MockRoundData.round, "unpaired_players", "get").mockReturnValue([MockPlayer1, MockPlayer2]);
      vi.spyOn(window, "confirm").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await fireEvent.click(
        within(table1Row).getByRole("button", { name: /delete/i }),
      );

      expect(deletePairing).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(table1Row).not.toBeInTheDocument();
    });

    it("does not delete a pairing if cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await fireEvent.click(
        within(table1Row).getByRole("button", { name: /delete/i }),
      );

      expect(deletePairing).not.toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledOnce();
      expect(table1Row).toBeInTheDocument();
    });
  });

  describe("using preset scores", () => {
    beforeEach(() => {
      vi.mocked(reportScore).mockResolvedValue(true);
    });

    it("Corp Win", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "score1", "get").mockReturnValue(3);
      vi.spyOn(MockRoundData.round.pairings[0], "score2", "get").mockReturnValue(0);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /corp win/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue("3");
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue("0");
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).not.toBeChecked();
    });

    it("Tie", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "score1", "get").mockReturnValue(1);
      vi.spyOn(MockRoundData.round.pairings[0], "score2", "get").mockReturnValue(1);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /tie/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue("1");
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue("1");
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).not.toBeChecked();
    });

    it("Intentional Draw", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "score1", "get").mockReturnValue(1);
      vi.spyOn(MockRoundData.round.pairings[0], "score2", "get").mockReturnValue(1);
      vi.spyOn(MockRoundData.round.pairings[0], "intentional_draw", "get").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /intentional draw/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue("1");
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue("1");
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).toBeChecked();
    });

    it("Runner Win", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "score1", "get").mockReturnValue(0);
      vi.spyOn(MockRoundData.round.pairings[0], "score2", "get").mockReturnValue(3);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /runner win/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue("0");
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue("3");
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).not.toBeChecked();
    });
  });

  describe("using custom scores", () => {
    beforeEach(() => {
      vi.mocked(reportScore).mockResolvedValue(true);
    });

    it("saves a custom score", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "score1", "get").mockReturnValue(1);
      vi.spyOn(MockRoundData.round.pairings[0], "score2", "get").mockReturnValue(2);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /show-custom/i }),
      );
      await user.type(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        "1",
      );
      await user.type(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        "2",
      );
      await user.click(
        within(table1Row).getByRole("button", { name: /save/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue("1");
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue("2");
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).not.toBeChecked();
    });

    it("saves an intentional draw", async () => {
      vi.spyOn(MockRoundData.round.pairings[0], "reported", "get").mockReturnValue(true);
      vi.spyOn(MockRoundData.round.pairings[0], "intentional_draw", "get").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /show-custom/i }),
      );
      await user.click(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      );
      await user.click(
        within(table1Row).getByRole("button", { name: /save/i }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).toBeChecked();
    });
  });
});
