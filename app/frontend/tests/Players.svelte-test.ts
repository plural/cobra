import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MockPlayerAlice,
  MockPlayerBob,
  MockPlayersData,
  MockTournament,
} from "./PlayersTestData";
import Players from "../players/Players.svelte";
import {
  getByLabelText,
  getByRole,
  render,
  screen,
} from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import {
  deletePlayer,
  dropPlayer,
  loadPlayers,
  Player,
  reinstatePlayer,
  savePlayer,
  togglePlayerLock,
} from "../players/PlayersData";
import {
  DeckVisibility,
  deckVisibilityString,
  saveTournament,
  setPlayerRegistrationStatus,
  setRegistrationStatus,
} from "../pairings/PairingsData";

const user = userEvent.setup();

vi.mock("../pairings/PairingsData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  saveTournament: vi.fn(() => true),
  setPlayerRegistrationStatus: vi.fn(() => true),
  setRegistrationStatus: vi.fn(() => true),
}));

vi.mock("../players/PlayersData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../players/PlayersData")>()),
  loadPlayers: vi.fn(() => MockPlayersData),
  togglePlayerLock: vi.fn(() => true),
  savePlayer: vi.fn(() => true),
  dropPlayer: vi.fn(() => true),
  deletePlayer: vi.fn(() => true),
  reinstatePlayer: vi.fn(() => true),
}));

describe("Players", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("when there are no dropped players", () => {
    beforeEach(() => {
      render(Players, { tournamentId: 1 });
      expect(loadPlayers).toHaveBeenCalledOnce();
    });

    it("displays active players", () => {
      const playerItems = screen.getAllByRole("listitem");

      expect(playerItems).toHaveLength(2);
      expect(getByLabelText(playerItems[0], "Name")).toHaveValue("Alice");
      expect(getByLabelText(playerItems[0], "Pronouns")).toHaveValue("she/her");
      expect(getByLabelText(playerItems[0], "Corp ID")).toHaveValue(
        "A Teia: IP Recovery",
      );
      expect(getByLabelText(playerItems[0], "Runner ID")).toHaveValue(
        "Arissana Rocha Nahu: Street Artist",
      );
      expect(
        getByRole(playerItems[0], "checkbox", {
          name: "Video coverage allowed",
        }),
      ).toBeChecked();
      expect(
        getByRole(playerItems[0], "checkbox", { name: "First round bye" }),
      ).not.toBeChecked();
      expect(getByLabelText(playerItems[0], "Fixed table number")).toHaveValue(
        null,
      );
      expect(getByLabelText(playerItems[1], "Name")).toHaveValue("Bob");
      expect(getByLabelText(playerItems[1], "Pronouns")).toHaveValue("he/him");
      expect(getByLabelText(playerItems[1], "Corp ID")).toHaveValue(
        "BANGUN: When Disaster Strikes",
      );
      expect(getByLabelText(playerItems[1], "Runner ID")).toHaveValue(
        "Barry “Baz” Wong: Tri-Maf Veteran",
      );
      expect(
        getByRole(playerItems[1], "checkbox", {
          name: "Video coverage allowed",
        }),
      ).not.toBeChecked();
      expect(
        getByRole(playerItems[1], "checkbox", { name: "First round bye" }),
      ).toBeChecked();
      expect(getByLabelText(playerItems[1], "Fixed table number")).toHaveValue(
        1,
      );
    });

    it("locks a player", async () => {
      const playerItems = screen.getAllByRole("listitem");

      await user.click(
        getByRole(playerItems[0], "button", { name: "Lock player" }),
      );

      const aliceEdit = structuredClone(MockPlayerAlice);
      aliceEdit.registration_locked = true;

      expect(togglePlayerLock).toHaveBeenCalledExactlyOnceWith(1, aliceEdit);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });

    it("unlocks a player", async () => {
      const playerItems = screen.getAllByRole("listitem");

      await user.click(
        getByRole(playerItems[1], "button", { name: "Unlock player" }),
      );

      const bobEdit = structuredClone(MockPlayerBob);
      bobEdit.registration_locked = false;

      expect(togglePlayerLock).toHaveBeenCalledExactlyOnceWith(1, bobEdit);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });

    it("saves player edits", async () => {
      const playerItems = screen.getAllByRole("listitem");

      expect(loadPlayers).toHaveBeenCalledOnce();

      await user.clear(getByLabelText(playerItems[0], "Name"));
      await user.type(getByLabelText(playerItems[0], "Name"), "Alice test");
      await user.clear(getByLabelText(playerItems[0], "Pronouns"));
      await user.type(getByLabelText(playerItems[0], "Pronouns"), "te/st");
      await user.click(
        getByRole(playerItems[0], "checkbox", {
          name: "Video coverage allowed",
        }),
      );
      await user.click(
        getByRole(playerItems[0], "checkbox", { name: "First round bye" }),
      );
      await user.clear(getByLabelText(playerItems[0], "Fixed table number"));
      await user.type(
        getByLabelText(playerItems[0], "Fixed table number"),
        "1",
      );

      await user.click(getByRole(playerItems[0], "button", { name: "Save" }));

      const aliceEdit = structuredClone(MockPlayerAlice);
      aliceEdit.name = "Alice test";
      aliceEdit.pronouns = "te/st";
      aliceEdit.include_in_stream = false;
      aliceEdit.first_round_bye = true;
      aliceEdit.fixed_table_number = 1;

      expect(savePlayer).toHaveBeenCalledExactlyOnceWith(1, aliceEdit);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });

    it("drops a player", async () => {
      const playerItems = screen.getAllByRole("listitem");

      await user.click(getByRole(playerItems[0], "button", { name: "Drop" }));

      expect(dropPlayer).toHaveBeenCalledExactlyOnceWith(1, MockPlayerAlice);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });

    it("deletes a player", async () => {
      const playerItems = screen.getAllByRole("listitem");

      expect(loadPlayers).toHaveBeenCalledOnce();

      vi.spyOn(window, "confirm").mockReturnValue(true);
      await user.click(getByRole(playerItems[0], "button", { name: "Delete" }));

      expect(deletePlayer).toHaveBeenCalledExactlyOnceWith(1, MockPlayerAlice);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });

    describe.each([
      [true, true, "open"],
      [true, false, "closed"],
      [false, true, "open, all locked"],
      [false, false, "closed"],
    ])("sets lock and registration status", (unlock, open, description) => {
      it(description, async () => {
        let loadCount = 1;

        const dropdown = screen.getByText(/Registration: .*/);
        await user.click(dropdown);

        const lockOption = screen.getByText(
          new RegExp(`${unlock ? "Unlock" : "Lock"} all players.*`),
        );
        if (!lockOption.classList.contains("disabled")) {
          vi.spyOn(
            MockTournament,
            "registration_unlocked",
            "get",
          ).mockReturnValue(unlock);
          vi.spyOn(MockTournament, "locked_players", "get").mockReturnValue(2);
          vi.spyOn(MockTournament, "unlocked_players", "get").mockReturnValue(
            0,
          );
          await user.click(lockOption);
          loadCount++;
          expect(setPlayerRegistrationStatus).toHaveBeenCalledExactlyOnceWith(
            1,
            !unlock,
          );
        }

        const registrationOption = screen.getByText(
          new RegExp(`${open ? "Open" : "Close"} registration.*`),
        );
        if (!registrationOption.classList.contains("disabled")) {
          vi.spyOn(MockTournament, "registration_open", "get").mockReturnValue(
            open,
          );
          await user.click(registrationOption);
          loadCount++;
          expect(setRegistrationStatus).toHaveBeenCalledExactlyOnceWith(
            1,
            open,
          );
        }

        expect(loadPlayers).toHaveBeenCalledTimes(loadCount);
        expect(dropdown).toHaveTextContent(`Registration: ${description}`);
      });
    });

    describe.each([
      [
        DeckVisibility.Private,
        DeckVisibility.Private,
        "swiss private, cut private",
      ],
      [DeckVisibility.Private, DeckVisibility.Open, "swiss private, cut open"],
      [
        DeckVisibility.Private,
        DeckVisibility.Public,
        "swiss private, cut public",
      ],
      [DeckVisibility.Open, DeckVisibility.Private, "swiss open, cut private"],
      [DeckVisibility.Open, DeckVisibility.Open, "swiss open, cut open"],
      [DeckVisibility.Open, DeckVisibility.Public, "swiss open, cut public"],
      [
        DeckVisibility.Public,
        DeckVisibility.Private,
        "swiss public, cut private",
      ],
      [DeckVisibility.Public, DeckVisibility.Open, "swiss public, cut open"],
      [
        DeckVisibility.Public,
        DeckVisibility.Public,
        "swiss public, cut public",
      ],
    ])(
      "sets deck visibility",
      (swissVisibility, cutVisibility, description) => {
        it(description, async () => {
          let loadCount = 1;

          vi.spyOn(window, "confirm").mockReturnValue(true);
          const tournamentEdit = structuredClone(MockTournament);

          const dropdown = screen.getByText(/Decks: .*/);
          await user.click(dropdown);

          const swissOption = screen.getByText(
            new RegExp(
              `Make decks in swiss ${deckVisibilityString(swissVisibility)}.*`,
            ),
          );
          if (!swissOption.classList.contains("disabled")) {
            vi.spyOn(
              MockTournament,
              "swiss_deck_visibility",
              "get",
            ).mockReturnValue(swissVisibility);
            await user.click(swissOption);
            loadCount++;

            tournamentEdit.swiss_deck_visibility = swissVisibility;
            expect(saveTournament).toHaveBeenCalledExactlyOnceWith(
              tournamentEdit,
            );
          }

          const cutOption = screen.getByText(
            new RegExp(
              `Make decks in cut ${deckVisibilityString(cutVisibility)}.*`,
            ),
          );
          if (!cutOption.classList.contains("disabled")) {
            vi.spyOn(
              MockTournament,
              "cut_deck_visibility",
              "get",
            ).mockReturnValue(cutVisibility);
            await user.click(cutOption);
            loadCount++;

            tournamentEdit.cut_deck_visibility = cutVisibility;
            expect(saveTournament).toHaveBeenCalledWith(tournamentEdit);
          }

          expect(loadPlayers).toHaveBeenCalledTimes(loadCount);
          expect(dropdown).toHaveTextContent(`Decks: ${description}`);
        });
      },
    );

    it("saves new player", async () => {
      const newPlayerSection = screen.getByRole("heading", {
        name: "Register New Player",
      }).parentElement;
      expect(newPlayerSection).not.toBeNull();
      if (!newPlayerSection) {
        return;
      }

      await user.type(getByLabelText(newPlayerSection, "Name"), "Charlie");
      await user.type(
        getByLabelText(newPlayerSection, "Pronouns"),
        "they/them",
      );
      await user.click(
        getByRole(newPlayerSection, "checkbox", {
          name: "Video coverage allowed",
        }),
      );
      await user.click(
        getByRole(newPlayerSection, "checkbox", { name: "First round bye" }),
      );
      await user.type(
        getByLabelText(newPlayerSection, "Fixed table number"),
        "1",
      );

      await user.click(
        getByRole(newPlayerSection, "button", { name: "Create" }),
      );

      const charlieEdit = new Player();
      charlieEdit.name = "Charlie";
      charlieEdit.pronouns = "they/them";
      charlieEdit.include_in_stream = false;
      charlieEdit.first_round_bye = true;
      charlieEdit.fixed_table_number = 1;

      expect(savePlayer).toHaveBeenCalledExactlyOnceWith(1, charlieEdit);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });
  });

  describe("when there are dropped players", () => {
    beforeEach(() => {
      vi.spyOn(MockPlayersData, "activePlayers", "get").mockReturnValue([
        MockPlayerAlice,
      ]);
      vi.spyOn(MockPlayersData, "droppedPlayers", "get").mockReturnValue([
        MockPlayerBob,
      ]);

      render(Players, { tournamentId: 1 });
      expect(loadPlayers).toHaveBeenCalledOnce();
    });

    it("reinstates dropped players", async () => {
      const droppedPlayerRows = screen.getAllByRole("row");

      expect(screen.getAllByRole("listitem")).toHaveLength(1);
      expect(droppedPlayerRows).toHaveLength(1);

      await user.click(
        getByRole(droppedPlayerRows[0], "button", { name: "Reinstate" }),
      );

      expect(reinstatePlayer).toHaveBeenCalledExactlyOnceWith(1, MockPlayerBob);
      expect(loadPlayers).toHaveBeenCalledTimes(2);
    });
  });
});
