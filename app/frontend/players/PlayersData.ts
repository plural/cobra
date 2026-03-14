import type { Identity } from "../identities/Identity";
import type { Tournament, TournamentPolicies } from "../pairings/PairingsData";

declare const Routes: {
  players_data_beta_tournament_players_path: (tournamentId: number) => string;
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
  user_id: number | null = null;
  corp_id: Identity | null = null;
  runner_id: Identity | null = null;
  registration_locked = false;
  include_in_stream = false;
  active: boolean | null = null;
  first_round_bye = false;
  manual_seed: number | null = null;
  side: string | null = null;
  side_label: string | null = null;
}
