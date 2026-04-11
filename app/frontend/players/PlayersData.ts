import { Identity } from "../identities/Identity";
import type { TournamentPolicies } from "../pairings/PairingsData";
import type { Tournament } from "../tournaments/TournamentSettings";
import { globalMessages } from "../utils/GlobalMessageState.svelte";
import { csrfToken } from "../utils/network";

declare const Routes: {
  players_data_beta_tournament_players_path: (tournamentId: number) => string;
  beta_tournament_players_path: (tournamentId: number) => string;
  beta_tournament_player_path: (
    tournamentId: number,
    playerId: number,
  ) => string;
  drop_beta_tournament_player_path: (
    tournamentId: number,
    playerId: number,
  ) => string;
  reinstate_beta_tournament_player_path: (
    tournamentId: number,
    playerId: number,
  ) => string;
  lock_registration_beta_tournament_player_path: (
    tournamentId: number,
    playerId: number,
  ) => string;
  unlock_registration_beta_tournament_player_path: (
    tournamentId: number,
    playerId: number,
  ) => string;
  decks_beta_tournament_players_path: (tournamentId: number) => string;
};

export async function loadPlayers(tournamentId: number) {
  const response = await fetch(
    Routes.players_data_beta_tournament_players_path(tournamentId),
    {
      method: "GET",
    },
  );

  return (await response.json()) as PlayersData;
}

export async function savePlayer(tournamentId: number, player: Player) {
  const route =
    player.id === 0
      ? Routes.beta_tournament_players_path(tournamentId)
      : Routes.beta_tournament_player_path(tournamentId, player.id);
  const response = await fetch(route, {
    method: player.id === 0 ? "POST" : "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken(),
    },
    body: JSON.stringify({ player: playerRequestObject(player) }),
  });

  const result = (await response.json()) as { id: number, errors?: string[] };
  globalMessages.errors = result.errors ?? [];

  return result.id;
}

export async function togglePlayerLock(tournamentId: number, player: Player) {
  const route = player.registration_locked
    ? Routes.unlock_registration_beta_tournament_player_path(
        tournamentId,
        player.id,
      )
    : Routes.lock_registration_beta_tournament_player_path(
        tournamentId,
        player.id,
      );
  const response = await fetch(route, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken(),
    },
    body: JSON.stringify({ player: playerRequestObject(player) }),
  });

  return response.status === 200;
}

export async function dropPlayer(tournamentId: number, player: Player) {
  const response = await fetch(
    Routes.drop_beta_tournament_player_path(tournamentId, player.id),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({ player: playerRequestObject(player) }),
    },
  );

  return response.status === 200;
}

export async function deletePlayer(tournamentId: number, player: Player) {
  const response = await fetch(
    Routes.beta_tournament_player_path(tournamentId, player.id),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({ player: playerRequestObject(player) }),
    },
  );

  return response.status === 200;
}

export async function reinstatePlayer(tournamentId: number, player: Player) {
  const response = await fetch(
    Routes.reinstate_beta_tournament_player_path(tournamentId, player.id),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrfToken(),
      },
      body: JSON.stringify({ player: playerRequestObject(player) }),
    },
  );

  return response.status === 200;
}

export async function loadDecks(tournamentId: number) {
  const response = await fetch(
    Routes.decks_beta_tournament_players_path(tournamentId),
    {
      method: "GET",
    },
  );

  return (await response.json()) as Deck[];
}

function playerRequestObject(player: Player) {
  return {
    name: player.name,
    pronouns: player.pronouns,
    corp_identity: player.corp_id.name,
    runner_identity: player.runner_id.name,
    include_in_stream: player.include_in_stream,
    first_round_bye: player.first_round_bye,
    manual_seed: player.manual_seed,
    fixed_table_number: player.fixed_table_number,
  };
}

export interface PlayersData {
  tournament: Tournament;
  tournamentPolicies: TournamentPolicies;
  activePlayers: Player[];
  droppedPlayers: Player[];
}

export class Player {
  id = 0;
  name = "";
  pronouns = "";
  name_with_pronouns = "";
  user_id = 0;
  corp_id = new Identity();
  runner_id = new Identity();
  registration_locked = false;
  include_in_stream = true;
  active: boolean | null = null;
  first_round_bye = false;
  manual_seed: number | null = null;
  fixed_table_number: number | null = null;
  side: string | null = null;
  side_label: string | null = null;
}

export interface Deck {
  details: {
    id: number;
    player_id: number;
    side_id: string;
    name: string | null;
    identity_title: string;
    min_deck_size: number;
    max_influence: number;
    nrdb_uuid: string | null;
    identity_nrdb_card_id: string;
    created_at: string;
    updated_at: string;
    identity_nrdb_printing_id: number | null;
    user_id: number;
    faction_id: string;
    mine: boolean;
    player_name: string;
  };
  cards: Card[];
}

export interface Card {
  id: number;
  deck_id: number;
  title: string;
  quantity: number;
  influence: number;
  nrdb_card_id: string;
  created_at: string;
  updated_at: string;
  nrdb_printing_id: number | null;
  card_type_id: string;
  faction_id: string;
  influence_cost: number;
}
