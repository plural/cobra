import { render, within } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deletePairing,
  loadPairings,
  PairingsData,
  Tournament,
} from "../pairings/PairingsData";
import Rounds from "../pairings/Rounds.svelte";
import { reportScore } from "../pairings/SelfReport";

const MockPlayer1 = {
  id: 1,
  name: "Alice",
  name_with_pronouns: "",
  side: null,
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
  side: null,
  user_id: null,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};
const MockPairingsData: PairingsData = {
  tournament: new Tournament(),
  policy: { update: true, custom_table_numbering: false },
  stages: [
    {
      id: 1,
      name: "Swiss",
      format: "swiss",
      is_single_sided: false,
      is_elimination: false,
      view_decks: false,
      rounds: [
        {
          id: 1,
          number: 1,
          completed: false,
          pairings: [
            {
              id: 1,
              table_number: 1,
              table_label: "Table 1",
              policy: {
                self_report: true,
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
      ],
    },
  ],
};

const user = userEvent.setup();

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPairings: vi.fn(() => MockPairingsData),
  deletePairing: vi.fn(() => true),
}));

vi.mock("../pairings/SelfReport", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/SelfReport")>()),
  reportScore: vi.fn(() => true),
}));

describe("Rounds", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("as organizer", () => {
    beforeEach(() => {
      render(Rounds, { tournamentId: 1 });
    });

    it("deletes a pairing", async () => {      
      vi.spyOn(MockPairingsData.stages[0].rounds[0], "pairings", "get").mockReturnValue([]);
      vi.spyOn(MockPairingsData.stages[0].rounds[0], "unpaired_players", "get").mockReturnValue([MockPlayer1, MockPlayer2]);
      vi.spyOn(window, "confirm").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /delete/i }),
      );
      expect(deletePairing).toHaveBeenCalledOnce();
      expect(loadPairings).toHaveBeenCalledTimes(2);
      expect(table1Row).not.toBeInTheDocument();
    });

    it("does not delete a pairing if cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: /delete/i }),
      );
      expect(deletePairing).not.toHaveBeenCalled();
      expect(loadPairings).toHaveBeenCalledOnce();
      expect(table1Row).toBeInTheDocument();
    });

    describe("using preset scores", () => {
      it("6-0", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score1", "get").mockReturnValue(6);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score2", "get").mockReturnValue(0);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /6-0/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        ).toHaveValue("6");
        expect(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        ).toHaveValue("0");
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });

      it("3-3 (C)", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score1", "get").mockReturnValue(3);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score2", "get").mockReturnValue(3);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /3-3 \(c\)/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        ).toHaveValue("3");
        expect(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        ).toHaveValue("3");
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });

      it("3-3 (R)", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score1", "get").mockReturnValue(3);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score2", "get").mockReturnValue(3);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /3-3 \(r\)/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        ).toHaveValue("3");
        expect(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        ).toHaveValue("3");
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });

      it("0-6", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score1", "get").mockReturnValue(0);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score2", "get").mockReturnValue(6);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /0-6/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        ).toHaveValue("0");
        expect(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        ).toHaveValue("6");
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });
    });

    describe("using custom scores", () => {
      it("saves a custom score", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score1", "get").mockReturnValue(1);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "score2", "get").mockReturnValue(2);

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
        expect(loadPairings).toHaveBeenCalledTimes(2);
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
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });

      it("saves an intentional draw", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "intentional_draw", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "two_for_one", "get").mockReturnValue(false);

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
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      });

      it("saves a 2 for 1", async () => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "reported", "get").mockReturnValue(true);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "intentional_draw", "get").mockReturnValue(false);
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0], "two_for_one", "get").mockReturnValue(true);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /show-custom/i }),
        );
        await user.click(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        );
        await user.click(
          within(table1Row).getByRole("button", { name: /save/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).toBeChecked();
      });
    });
  });

  describe("as player", () => {
    beforeEach(() => {
      vi.spyOn(MockPairingsData.policy, "update", "get").mockReturnValue(false);

      render(Rounds);
    });

    it("does not show the TO reporting buttons", () => {
      const centreScoreDiv = document.getElementsByClassName(
        "centre_score",
      )[0] as HTMLElement;
      expect(centreScoreDiv).not.toContainElement(
        within(centreScoreDiv).queryByRole("button", {
          name: /6-0/i,
        }),
      );
    });

    it("does not show the Delete button", () => {
      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      expect(table1Row).not.toContainElement(
        within(table1Row).queryByRole("button", {
          name: /delete/i,
        }),
      );
    });
  });
});
