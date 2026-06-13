import { beforeEach, describe, expect, it, vi } from "vitest";
import Registration from "../players/Registration.svelte";
import { MockTournament } from "./TournamentTestData";
import { MockPlayerBob, MockPlayerBobDecks, MockPlayerBobNrdbDecks } from "./PlayersTestData";
import userEvent from "@testing-library/user-event";
import { getByLabelText, getByRole, render, screen, waitFor } from "@testing-library/svelte";
import { loadTournament } from "../tournaments/TournamentSettings";
import { loadDecks, loadPlayer, savePlayer } from "../players/PlayersData";
import { Identity } from "../identities/Identity";
import { getPrintings, type NrdbDeck } from "../utils/decks.svelte";
import type { Printing } from "../lib/api_types";

vi.mock("../tournaments/TournamentSettings", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../pairings/PairingsData")>()),
  loadTournament: vi.fn(() => MockTournament),
}));

vi.mock("../players/PlayersData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../players/PlayersData")>()),
  loadPlayer: vi.fn(() => MockPlayerBob),
  loadDecks: vi.fn(() => []),
  savePlayer: vi.fn(() => true),
}));

vi.mock("../utils/decks.svelte", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("../utils/decks.svelte")>()),
    getPrintings: vi.fn(() => MockPrintings),
  };
});

const MockPrintings = new Map<string, Printing>([
  [
    "35068",
    {
      id: "35068",
      type: "printings",
      attributes: {
        card_id: "bangun_when_disaster_strikes",
        title: "BANGUN: When Disaster Strikes",
        card_type_id: "corp_identity",
        side_id: "corp",
        faction_id: "weyland_consortium",
        influence_cost: null,
        influence_limit: 15,
        minimum_deck_size: 45
      }
    }
  ],
  [
    "30075",
    {
      id: "30075",
      type: "printings",
      attributes: {
        card_id: "hedge_fund",
        title: "Hedge Fund",
        card_type_id: "operation",
        side_id: "corp",
        faction_id: "neutral_corp",
        influence_cost: 0,
        influence_limit: null,
        minimum_deck_size: null
      }
    }
  ],
  [
    "35012",
    {
      id: "35012",
      type: "printings",
      attributes: {
        card_id: "barry_baz_wong_tri_maf_veteran",
        title: "Barry “Baz” Wong: Tri-Maf Veteran",
        card_type_id: "runner_identity",
        side_id: "runner",
        faction_id: "criminal",
        influence_cost: null,
        influence_limit: 15,
        minimum_deck_size: 45
      }
    }
  ],
  [
    "30030",
    {
      id: "30030",
      type: "printings",
      attributes: {
        card_id: "sure_gamble",
        title: "Sure Gamble",
        card_type_id: "event",
        side_id: "runner",
        faction_id: "neutral_runner",
        influence_cost: 0,
        influence_limit: null,
        minimum_deck_size: null
      }
    }
  ],
]);

const user = userEvent.setup();

describe("Registration", () => {
  async function renderRegistration(nrdbDecks: NrdbDeck[] = []) {
    render(Registration, { tournamentId: MockTournament.id, playerId: MockPlayerBob.id, nrdbDecks: nrdbDecks });

    await waitFor(() => {
      expect(loadTournament).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(loadPlayer).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(loadDecks).toHaveBeenCalledOnce();
    });
    if (nrdbDecks.length > 0) {
      await waitFor(() => {
        expect(getPrintings).toHaveBeenCalledOnce();
      });
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("displays new player information correctly", async () => {
    await renderRegistration();

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

  it("allows standard player info to be edited", async () => {
    await renderRegistration();

    const registrationCard = screen.getByLabelText(
      "registration information",
    );
    await user.clear(getByLabelText(registrationCard, "Name"));
    await user.type(getByLabelText(registrationCard, "Name"), "Bob Again");
    await user.clear(getByLabelText(registrationCard, "Pronouns"));
    await user.type(getByLabelText(registrationCard, "Pronouns"), "they/them");
    await user.click(getByLabelText(registrationCard, "Video coverage allowed"));

    await user.click(getByRole(registrationCard, "button", { name: "Save" }));

    const bobEdit = structuredClone(MockPlayerBob);
    bobEdit.name = "Bob Again";
    bobEdit.pronouns = "they/them";
    bobEdit.include_in_stream = true;
    bobEdit.corp_id = new Identity();
    bobEdit.runner_id = new Identity();

    expect(savePlayer).toHaveBeenCalledExactlyOnceWith(MockTournament.id, bobEdit, true);
  });

  it("allows deck selection", async () => {
    await renderRegistration(MockPlayerBobNrdbDecks);

    const corpDeckHeaderTable = screen.getByLabelText("corp deck");
    const runnerDeckHeaderTable = screen.getByLabelText("runner deck");

    expect(corpDeckHeaderTable).toHaveTextContent("No deck selected");
    expect(runnerDeckHeaderTable).toHaveTextContent("No deck selected");

    const corpDeckButton = getByRole(screen.getByLabelText("NRDB corp decks"), "button", { name: /bob's bangun.*/i });
    expect(corpDeckButton).not.toHaveClass("active");
    await user.click(corpDeckButton);
    expect(corpDeckButton).toHaveClass("active");
    expect(screen.getByLabelText("corp deck")).toHaveTextContent("Bob's BANGUN");
    expect(screen.getByLabelText("corp deck ID")).toHaveTextContent("BANGUN: When Disaster Strikes");
    expect(screen.getByLabelText("corp deck list")).toHaveTextContent("3 Hedge Fund");

    const runnerDeckButton = getByRole(screen.getByLabelText("NRDB runner decks"), "button", { name: /bob's baz.*/i });
    expect(runnerDeckButton).not.toHaveClass("active");
    await user.click(runnerDeckButton);
    expect(runnerDeckButton).toHaveClass("active");
    expect(runnerDeckHeaderTable).toHaveTextContent("Bob's Baz");
    expect(screen.getByLabelText("runner deck ID")).toHaveTextContent("Barry “Baz” Wong: Tri-Maf Veteran");
    expect(screen.getByLabelText("runner deck list")).toHaveTextContent("3 Sure Gamble");
  });

  it("displays existing decks correctly", async () => {
    vi.mocked(loadDecks).mockImplementation(() =>
      Promise.resolve(MockPlayerBobDecks),
    );
    await renderRegistration(MockPlayerBobNrdbDecks);

    expect(getByRole(screen.getByLabelText("NRDB corp decks"), "button", { name: /bob's bangun.*/i })).toHaveClass("active");
    expect(screen.getByLabelText("corp deck")).toHaveTextContent("Bob's BANGUN");
    expect(screen.getByLabelText("corp deck ID")).toHaveTextContent("BANGUN: When Disaster Strikes");
    expect(screen.getByLabelText("corp deck list")).toHaveTextContent("3 Hedge Fund");

    expect(getByRole(screen.getByLabelText("NRDB runner decks"), "button", { name: /bob's baz.*/i })).toHaveClass("active");
    expect(screen.getByLabelText("runner deck")).toHaveTextContent("Bob's Baz");
    expect(screen.getByLabelText("runner deck ID")).toHaveTextContent("Barry “Baz” Wong: Tri-Maf Veteran");
    expect(screen.getByLabelText("runner deck list")).toHaveTextContent("3 Sure Gamble");
  });
  
  // TODO: Edit player's decks as TO (add, remove, change card, change quantity, change ID)
});
