import { getByRole, getByText, queryByRole, render, within } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import {
  deletePairing,
  loadPairings,
} from "../pairings/PairingsData";
import Rounds from "../pairings/Rounds.svelte";
import { reportScore } from "../pairings/SelfReport";
import { MockPairingsData, MockPlayer1, MockPlayer2, MockSelfReport } from "./RoundsTestData";

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
      render(Rounds, { tournamentId: 0 });
    });

    it("deletes a pairing", async () => {
      vi.spyOn(
        MockPairingsData.stages[0].rounds[0],
        "pairings",
        "get",
      ).mockReturnValue([]);
      vi.spyOn(
        MockPairingsData.stages[0].rounds[0],
        "unpaired_players",
        "get",
      ).mockReturnValue([MockPlayer1, MockPlayer2]);
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

    describe.each([
      [6, 0, false, false, /6-0/i, "6 - 0"],
      [3, 3, false, false, /3-3 \(c\)/i, "3 - 3 (c)"],
      [3, 3, false, false, /3-3 \(r\)/i, "3 - 3 (R)"],
      [6, 0, false, false, /0-6/i, "0 - 6"]
    ])("using preset score", (score1, score2, id, twoForOne, buttonText, scoreText) => {
      test(scoreText, async () => {
        vi.spyOn(
        MockPairingsData.stages[0].rounds[0].pairings[0],
        "reported",
        "get",
      ).mockReturnValue(true);
      vi.spyOn(
        MockPairingsData.stages[0].rounds[0].pairings[0],
        "score1",
        "get",
      ).mockReturnValue(score1);
      vi.spyOn(
        MockPairingsData.stages[0].rounds[0].pairings[0],
        "score2",
        "get",
      ).mockReturnValue(score2);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: buttonText }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadPairings).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue(score1.toString());
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue(score2.toString());
      if (id) {
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).toBeChecked();
      } else {
        expect(
          within(table1Row).getByRole("checkbox", {
            name: /intentional draw/i,
          }),
        ).not.toBeChecked();
      }
      if (twoForOne) {
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).toBeChecked();
      } else {
        expect(
          within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
        ).not.toBeChecked();
      }
      });
    });

    describe.each([
      [1, 2, false, false, "saves a custom score" ],
      [3, 3, true, false, "saves an intentional draw"],
      [6, 0, false, true, "saves a 2 for 1"]
    ])("using custom score", (score1, score2, id, twoForOne, testName) => {
      it(testName, async () => {
        vi.spyOn(
          MockPairingsData.stages[0].rounds[0].pairings[0],
          "reported",
          "get",
        ).mockReturnValue(true);
        vi.spyOn(
          MockPairingsData.stages[0].rounds[0].pairings[0],
          "score1",
          "get",
        ).mockReturnValue(score1);
        vi.spyOn(
          MockPairingsData.stages[0].rounds[0].pairings[0],
          "score2",
          "get",
        ).mockReturnValue(score2);
        vi.spyOn(
          MockPairingsData.stages[0].rounds[0].pairings[0],
          "intentional_draw",
          "get",
        ).mockReturnValue(id);
        vi.spyOn(
          MockPairingsData.stages[0].rounds[0].pairings[0],
          "two_for_one",
          "get",
        ).mockReturnValue(twoForOne);

        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        await user.click(
          within(table1Row).getByRole("button", { name: /show-custom/i }),
        );
        await user.type(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
          score1.toString(),
        );
        await user.type(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
          score2.toString(),
        );
        if (id) {
          await user.click(
            within(table1Row).getByRole("checkbox", {
              name: /intentional draw/i,
            }),
          );
        }
        if (twoForOne) {
          await user.click(
            within(table1Row).getByRole("checkbox", {
              name: /2 for 1/i,
            }),
          );
        }
        await user.click(
          within(table1Row).getByRole("button", { name: /save/i }),
        );

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadPairings).toHaveBeenCalledTimes(2);
        expect(
          within(table1Row).getByRole("textbox", { name: /corp-score/i }),
        ).toHaveValue(score1.toString());
        expect(
          within(table1Row).getByRole("textbox", { name: /runner-score/i }),
        ).toHaveValue(score2.toString());
        if (id) {
          expect(
            within(table1Row).getByRole("checkbox", {
              name: /intentional draw/i,
            }),
          ).toBeChecked();
        } else {
          expect(
            within(table1Row).getByRole("checkbox", {
              name: /intentional draw/i,
            }),
          ).not.toBeChecked();
        }
        if (twoForOne) {
          expect(
            within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
          ).toBeChecked();
        } else {
          expect(
            within(table1Row).getByRole("checkbox", { name: /2 for 1/i }),
          ).not.toBeChecked();
        }
      });
    });

    it("does not show the Report Pairing button", () => {
      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      expect(table1Row).not.toContainElement(
        within(table1Row).queryByRole("button", {
          name: /report pairing/i,
        }),
      );
    });
  });

  describe("as player", () => {
    beforeEach(() => {
      vi.spyOn(MockPairingsData.policy, "update", "get").mockReturnValue(false);
    });

    describe("does not show", () => {
      beforeEach(() => {
        render(Rounds, { tournamentId: 0 });
      });

      it("the TO reporting buttons", () => {
        const centreScoreDiv = document.getElementsByClassName(
          "centre_score",
        )[0] as HTMLElement;
        expect(centreScoreDiv).not.toContainElement(
          within(centreScoreDiv).queryByRole("button", {
            name: /6-0/i,
          }),
        );
      });

      it("the Delete button", () => {
        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        expect(table1Row).not.toContainElement(
          within(table1Row).queryByRole("button", {
            name: /delete/i,
          }),
        );
      });

      it("the Report Pairing button when self-reporting is not enabled", () => {
        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        expect(queryByRole(table1Row, "button", { name: /report pairing/i, })).not.toBeTruthy();
      });
    });

    describe("self-reporting enabled", () => {
      beforeEach(() => {
        vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0].policy, "self_report", "get").mockReturnValue(true);

        render(Rounds, { tournamentId: 0 });
      });

      describe.each([
        [6, 0, /6-0/i, "6 - 0"],
        [3, 3, /3-3 \(c\)/i, "3 - 3 (c)"],
        [3, 3, /3-3 \(r\)/i, "3 - 3 (R)"],
        [6, 0, /0-6/i, "0 - 6"]
      ])("using preset score", (score1, score2, buttonText, scoreText) => {
        test(scoreText, async () => {
          vi.spyOn(MockPairingsData.stages[0].rounds[0].pairings[0].policy, "self_report", "get").mockReturnValue(false);
          vi.spyOn(
            MockPairingsData.stages[0].rounds[0].pairings[0],
            "self_reports",
            "get",
          ).mockReturnValue([MockSelfReport]);
          vi.spyOn(MockSelfReport, "score1", "get").mockReturnValue(score1);
          vi.spyOn(MockSelfReport, "score2", "get").mockReturnValue(score2);
          vi.spyOn(MockSelfReport, "label", "get").mockReturnValue(scoreText);

          const table1Row = document.getElementsByClassName(
            "table_1",
          )[0] as HTMLElement;
          await user.click(
            getByRole(table1Row, "button", { name: /report pairing/i, })
          );

          const reportDialog = document.getElementById("reportModal");
          expect(reportDialog).not.toBeNull();
          if (!reportDialog) {
            return;
          }
          await user.click(
            getByText(reportDialog, buttonText)
          );

          expect(reportScore).toHaveBeenCalledOnce();
          expect(loadPairings).toHaveBeenCalledTimes(2);
          expect(queryByRole(table1Row, "button", { name: /report pairing/i, })).not.toBeTruthy();
          expect(getByText(table1Row, `Report: ${scoreText}`)).toBeTruthy();
        });
      });
    });
  });
});
