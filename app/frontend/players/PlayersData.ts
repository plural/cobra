import { Identity } from "../identities/Identity";
import type { Tournament, TournamentPolicies } from "../pairings/PairingsData";
import { csrfToken } from "../utils/network";

declare const Routes: {
  players_data_beta_tournament_players_path: (tournamentId: number) => string;
  beta_tournament_player_path: (tournamentId: number, playerId: number) => string;
};

export async function loadPlayers(tournamentId: number): Promise<PlayersData> {
  const response = await fetch(
    Routes.players_data_beta_tournament_players_path(tournamentId),
    {
      method: "GET",
    },
  );

  return (await response.json()) as PlayersData;
}

export async function savePlayer(tournamentId: number, player: Player) {
  const response = await fetch(
    Routes.beta_tournament_player_path(tournamentId, player.id),
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

function playerRequestObject(player: Player) {
  return {
    name: player.name,
    pronouns: player.pronouns,
    corp_identity: player.corp_id.name,
    runner_identity: player.runner_id.name,
    include_in_stream: player.include_in_stream,
    first_round_bye: player.first_round_bye,
    manual_seed: player.manual_seed,
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
  include_in_stream = false;
  active: boolean | null = null;
  first_round_bye = false;
  manual_seed: number | null = null;
  side: string | null = null;
  side_label: string | null = null;
}
