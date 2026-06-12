import { beforeEach, describe, expect, it, vi } from "vitest";
import Registration from "../players/Registration.svelte";
import { MockTournament } from "./TournamentTestData";
import { MockPlayerBob } from "./PlayersTestData";
import userEvent from "@testing-library/user-event";
import { getByLabelText, render, screen, waitFor } from "@testing-library/svelte";
import { loadTournament } from "../tournaments/TournamentSettings";
import { loadDecks, loadPlayer } from "../players/PlayersData";

vi.mock("../tournaments/TournamentSettings", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadTournament: vi.fn(() => MockTournament),
}));

vi.mock("../players/PlayersData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadPlayer: vi.fn(() => MockPlayerBob),
  loadDecks: vi.fn(() => []),
}));

const user = userEvent.setup();

describe("Registration", () => {
  async function renderRegistration() {
    render(Registration, { tournamentId: MockTournament.id, playerId: MockPlayerBob.id, nrdbDecks: [] });

    await waitFor(() => {
      expect(loadTournament).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(loadPlayer).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(loadDecks).toHaveBeenCalledOnce();
    });
    // TODO: Expect loadPrintings()
  }

  beforeEach(async () => {
    vi.restoreAllMocks();

    await renderRegistration();
  });

  it("displays new player information correctly", () => {
    const registrationCard = screen.getByLabelText(
      "registration information",
    );
    expect(getByLabelText(registrationCard, "Name")).toHaveValue("Bob");
    expect(getByLabelText(registrationCard, "Pronouns")).toHaveValue("he/him");
    expect(getByLabelText(registrationCard, "Video coverage allowed")).not.toBeChecked();

    expect(screen.queryByText("You have no decks saved in NRDB.", { exact: false })).not.toBeNull();
    expect(screen.getByLabelText("corp deck")).toHaveTextContent("No deck selected");
    expect(screen.getByLabelText("runner deck")).toHaveTextContent("No deck selected");
  });

  // it("allows deck selection", () => {
  //   // TODO
  // });
  
  // it("allows standard player info to be edited", async () => {
  //   // TODO
  //   const registrationCard = screen.getByLabelText(
  //     "registration information",
  //   );
  //   await user.clear(getByLabelText(registrationCard, "Name"));
  // });

  // TODO: Displays existing decks correctly
  
  // TODO: Edit player's decks as TO (add, remove, change card, change quantity, change ID)
});
