import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockPairingsData, MockSwissStage } from "./RoundsTestData";
import {
  getByLabelText,
  queryByText,
  render,
  screen,
} from "@testing-library/svelte";
import Pairings from "../pairings/Pairings.svelte";
import { loadPairings } from "../pairings/PairingsData";

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPairings: vi.fn(() => MockPairingsData),
}));

describe("Pairings", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("when decks are not visible", () => {
    beforeEach(() => {
      render(Pairings, { tournamentId: 1, roundId: 1 });
    });

    it("displays pairings twice with players swapped", () => {
      const rows = screen.getAllByRole("row");

      expect(loadPairings).toHaveBeenCalledOnce();
      expect(getByLabelText(rows[1], "player")).toHaveTextContent(
        "Alice (she/her)",
      );
      expect(getByLabelText(rows[1], "opponent")).toHaveTextContent(
        "Bob (he/him)",
      );
      expect(getByLabelText(rows[2], "player")).toHaveTextContent(
        "Bob (he/him)",
      );
      expect(getByLabelText(rows[2], "opponent")).toHaveTextContent(
        "Alice (she/her)",
      );
    });

    it("does not display the Decks column", () => {
      const rowGroups = screen.getAllByRole("rowgroup");

      expect(loadPairings).toHaveBeenCalledOnce();
      expect(queryByText(rowGroups[0], "Decks")).toBeNull();
    });
  });

  describe("when decks are visible", () => {
    beforeEach(() => {
      vi.spyOn(MockSwissStage, "view_decks", "get").mockReturnValue(true);

      render(Pairings, { tournamentId: 1, roundId: 1 });
    });

    it("does displays the Decks column", () => {
      const rowGroups = screen.getAllByRole("rowgroup");

      expect(loadPairings).toHaveBeenCalledOnce();
      expect(queryByText(rowGroups[0], "Decks")).not.toBeNull();
    });
  });
});
