import {
  getByRole,
  getByText,
  queryByTestId,
  queryByText,
  render,
  screen,
  within,
} from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditRound from "../pairings/EditRound.svelte";
import { loadRound } from "../pairings/RoundData";
import {
  completeRound,
  createPairing,
  deletePairing,
  deleteRound,
  rePairRound,
} from "../pairings/PairingsData";
import {
  changePlayerSide,
  reportScore,
  resetReports,
} from "../pairings/SelfReport";
import {
  MockPlayerAlice,
  MockPlayerBob,
  MockRoundData,
  MockSelfReport2,
  Pairing1,
} from "./EditRoundTestData";

const user = userEvent.setup();

vi.mock("../pairings/RoundData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/RoundData")>()),
  loadRound: vi.fn(() => MockRoundData),
}));

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  rePairRound: vi.fn(() => true),
  completeRound: vi.fn(() => true),
  deleteRound: vi.fn(() => true),
  createPairing: vi.fn(() => true),
  deletePairing: vi.fn(() => true),
}));

vi.mock("../pairings/SelfReport", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/SelfReport")>()),
  changePlayerSide: vi.fn(() => true),
  reportScore: vi.fn(() => true),
  resetReports: vi.fn(() => true),
}));

describe("EditRound", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("re-pair", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("re-pairs the round", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);

      await user.click(screen.getByRole("button", { name: /re-pair/i }));

      expect(rePairRound).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
    });

    it("does not re-pair the round if cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      await user.click(screen.getByRole("button", { name: /re-pair/i }));

      expect(rePairRound).not.toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledOnce();
    });
  });

  describe("complete", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("completes the round", async () => {
      vi.spyOn(MockRoundData.round, "completed", "get").mockReturnValue(true);
      vi.spyOn(window, "confirm").mockReturnValue(true);

      await user.click(screen.getByRole("button", { name: /complete/i }));

      expect(completeRound).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        screen.getByRole("button", { name: /uncomplete/i }),
      ).toBeInTheDocument();
    });

    it("does not complete the round if cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      await user.click(screen.getByRole("button", { name: /complete/i }));

      expect(completeRound).not.toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledOnce();
      expect(
        screen.queryByRole("button", { name: /uncomplete/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("delete round", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("deletes the round", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);

      await user.click(screen.getByRole("button", { name: /delete round/i }));

      expect(deleteRound).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledOnce();
    });

    it("does not delete the round if cancelled", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);

      await user.click(screen.getByRole("button", { name: /delete round/i }));

      expect(deleteRound).not.toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledOnce();
    });
  });

  describe("create pairing", () => {
    beforeEach(() => {
      vi.spyOn(MockRoundData.round, "pairings", "get").mockReturnValue([]);
      vi.spyOn(MockRoundData.round, "unpaired_players", "get").mockReturnValue([
        MockPlayerAlice,
        MockPlayerBob,
      ]);

      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("creates a pairing", async () => {
      expect(document.getElementsByClassName("table_1").length).toBe(0);

      vi.spyOn(Pairing1, "table_number", "get").mockReturnValue(11);
      vi.spyOn(MockRoundData.round, "pairings", "get").mockReturnValue([
        Pairing1,
      ]);
      vi.spyOn(MockRoundData.round, "unpaired_players", "get").mockReturnValue(
        [],
      );

      const newPairingForm = document.getElementById("new_pairing");
      expect(newPairingForm).not.toBeNull();
      if (!newPairingForm) {
        return;
      }

      await user.type(
        getByRole(newPairingForm, "spinbutton", {
          name: /new pairing table number/i,
        }),
        "11",
      );
      await user.selectOptions(
        getByRole(newPairingForm, "combobox", {
          name: /^new pairing player 1$/i,
        }),
        "Alice",
      );
      await user.selectOptions(
        getByRole(newPairingForm, "combobox", {
          name: /new pairing player 1 side/i,
        }),
        "Corp",
      );
      await user.selectOptions(
        getByRole(newPairingForm, "combobox", {
          name: /^new pairing player 2$/i,
        }),
        "Bob",
      );
      await user.click(
        getByRole(newPairingForm, "button", { name: /create/i }),
      );

      expect(createPairing).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);

      expect(
        document.getElementsByClassName("table_11")[0],
      ).toBeInTheDocument();
    });
  });

  describe("delete pairings", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("deletes a pairing", async () => {
      vi.spyOn(MockRoundData.round, "pairings", "get").mockReturnValue([]);
      vi.spyOn(MockRoundData.round, "unpaired_players", "get").mockReturnValue([
        MockPlayerAlice,
        MockPlayerBob,
      ]);
      vi.spyOn(window, "confirm").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
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
      await user.click(
        within(table1Row).getByRole("button", { name: /delete/i }),
      );

      expect(deletePairing).not.toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledOnce();
      expect(table1Row).toBeInTheDocument();
    });
  });

  describe("player side", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("changes player side", async () => {
      vi.spyOn(MockPlayerAlice, "side", "get").mockReturnValue("runner");
      vi.spyOn(MockPlayerBob, "side", "get").mockReturnValue("corp");
      vi.spyOn(window, "confirm").mockReturnValue(true);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      const aliceRunnerButton = getByRole(table1Row, "button", {
        name: /change alice to runner/i,
      });

      expect(aliceRunnerButton).not.toContainElement(
        queryByTestId(aliceRunnerButton, "selected"),
      );

      await user.click(aliceRunnerButton);

      expect(changePlayerSide).toHaveBeenCalled();
      expect(loadRound).toHaveBeenCalledTimes(2);

      const aliceRunnerButton2 = getByRole(table1Row, "button", {
        name: /change alice to runner/i,
      });
      expect(aliceRunnerButton2).toContainElement(
        queryByTestId(aliceRunnerButton2, "selected"),
      );
    });
  });

  describe.each([
    [3, 0, "Corp Win"],
    [3, 3, "Tie"],
    [3, 3, "Intentional Draw"],
    [6, 0, "Runner Win"],
  ])("using preset score", (score1, score2, buttonText) => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it(buttonText, async () => {
      vi.spyOn(Pairing1, "reported", "get").mockReturnValue(true);
      vi.spyOn(Pairing1, "score1", "get").mockReturnValue(score1);
      vi.spyOn(Pairing1, "score2", "get").mockReturnValue(score2);

      const table1Row = document.getElementsByClassName(
        "table_1",
      )[0] as HTMLElement;
      await user.click(
        within(table1Row).getByRole("button", { name: buttonText }),
      );

      expect(reportScore).toHaveBeenCalledOnce();
      expect(loadRound).toHaveBeenCalledTimes(2);
      expect(
        within(table1Row).getByRole("textbox", { name: /corp-score/i }),
      ).toHaveValue(score1.toString());
      expect(
        within(table1Row).getByRole("textbox", { name: /runner-score/i }),
      ).toHaveValue(score2.toString());
      expect(
        within(table1Row).getByRole("checkbox", {
          name: /intentional draw/i,
        }),
      ).not.toBeChecked();
    });
  });

  describe("using custom scores", () => {
    beforeEach(() => {
      render(EditRound, { tournamentId: 1, roundId: 1 });
    });

    it("saves a custom score", async () => {
      vi.spyOn(Pairing1, "reported", "get").mockReturnValue(true);
      vi.spyOn(Pairing1, "score1", "get").mockReturnValue(1);
      vi.spyOn(Pairing1, "score2", "get").mockReturnValue(2);

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
      vi.spyOn(
        MockRoundData.round.pairings[0],
        "reported",
        "get",
      ).mockReturnValue(true);
      vi.spyOn(
        MockRoundData.round.pairings[0],
        "intentional_draw",
        "get",
      ).mockReturnValue(true);

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

  describe("manage self-reports", () => {
    describe("when self-reports agree", () => {
      beforeEach(() => {
        render(EditRound, { tournamentId: 1, roundId: 1 });
      });

      it("accepts a report", async () => {
        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;

        const reportsButton = within(table1Row).getByRole("button", {
          name: /reports/i,
        });
        expect(reportsButton).not.toContainElement(
          queryByTestId(reportsButton, "reportConflict"),
        );

        await user.click(reportsButton);

        const reportDialog = document.getElementById("reports1");
        expect(reportDialog).not.toBeNull();
        if (!reportDialog) {
          return;
        }
        const aliceAcceptButton = getByText(reportDialog, /accept alice/i);
        expect(reportDialog).toContainElement(
          getByText(reportDialog, /alice reported: 6 - 0/i),
        );
        expect(reportDialog).toContainElement(
          getByText(reportDialog, /bob reported: 6 - 0/i),
        );
        expect(reportDialog).toContainElement(aliceAcceptButton);
        expect(reportDialog).toContainElement(
          queryByText(reportDialog, /accept bob/i),
        );

        vi.spyOn(Pairing1, "reported", "get").mockReturnValue(true);
        vi.spyOn(Pairing1, "score1", "get").mockReturnValue(6);
        vi.spyOn(Pairing1, "score2", "get").mockReturnValue(0);
        await user.click(aliceAcceptButton);

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadRound).toHaveBeenCalledTimes(2);
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
      });
    });

    describe("when self-reports disagree", () => {
      beforeEach(() => {
        vi.spyOn(MockSelfReport2, "score1", "get").mockReturnValue(0);
        vi.spyOn(MockSelfReport2, "score2", "get").mockReturnValue(6);
        vi.spyOn(MockSelfReport2, "score1_corp", "get").mockReturnValue(0);
        vi.spyOn(MockSelfReport2, "score1_runner", "get").mockReturnValue(0);
        vi.spyOn(MockSelfReport2, "score2_corp", "get").mockReturnValue(3);
        vi.spyOn(MockSelfReport2, "score2_runner", "get").mockReturnValue(3);

        render(EditRound, { tournamentId: 1, roundId: 1 });
      });

      it("accepts a report", async () => {
        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;

        const reportsButton = within(table1Row).getByRole("button", {
          name: /reports/i,
        });
        expect(reportsButton).toContainElement(
          queryByTestId(reportsButton, "reportConflict"),
        );

        await user.click(reportsButton);

        const reportDialog = document.getElementById("reports1");
        expect(reportDialog).not.toBeNull();
        if (!reportDialog) {
          return;
        }
        const aliceAcceptButton = getByText(reportDialog, /accept alice/i);
        expect(reportDialog).toContainElement(
          getByText(reportDialog, /alice reported: 6 - 0/i),
        );
        expect(reportDialog).toContainElement(
          getByText(reportDialog, /bob reported: 0 - 6/i),
        );
        expect(reportDialog).toContainElement(aliceAcceptButton);
        expect(reportDialog).toContainElement(
          queryByText(reportDialog, /accept bob/i),
        );

        vi.spyOn(Pairing1, "reported", "get").mockReturnValue(true);
        vi.spyOn(Pairing1, "score1", "get").mockReturnValue(6);
        vi.spyOn(Pairing1, "score2", "get").mockReturnValue(0);
        await user.click(aliceAcceptButton);

        expect(reportScore).toHaveBeenCalledOnce();
        expect(loadRound).toHaveBeenCalledTimes(2);
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
      });

      it("resets the reports", async () => {
        const table1Row = document.getElementsByClassName(
          "table_1",
        )[0] as HTMLElement;
        const reportsButton = within(table1Row).getByRole("button", {
          name: /reports/i,
        });

        await user.click(reportsButton);

        const reportDialog = document.getElementById("reports1");
        expect(reportDialog).not.toBeNull();
        if (!reportDialog) {
          return;
        }

        vi.spyOn(Pairing1, "self_reports", "get").mockReturnValue(null);
        vi.spyOn(Pairing1, "reported", "get").mockReturnValue(false);
        vi.spyOn(Pairing1, "score1", "get").mockReturnValue(0);
        vi.spyOn(Pairing1, "score2", "get").mockReturnValue(0);
        await user.click(getByText(reportDialog, /reset/i));

        expect(resetReports).toHaveBeenCalledOnce();
        expect(loadRound).toHaveBeenCalledTimes(2);

        await user.click(reportsButton);

        expect(reportDialog).not.toContainElement(
          queryByText(reportDialog, /alice reported: 6 - 0/i),
        );
        expect(reportDialog).not.toContainElement(
          queryByText(reportDialog, /bob reported: 0 - 6/i),
        );
        expect(reportDialog).not.toContainElement(
          queryByText(reportDialog, /accept alice/i),
        );
        expect(reportDialog).not.toContainElement(
          queryByText(reportDialog, /accept bob/i),
        );
      });
    });
  });
});
