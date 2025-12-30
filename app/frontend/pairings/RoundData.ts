import { globalMessages } from "../utils/GlobalMessageState.svelte";
import {
  Tournament,
  TournamentPolicies,
  type Round,
  type Stage,
} from "./PairingsData";

export async function loadRound(
  tournamentId: number,
  roundId: number,
): Promise<RoundData> {
  const response = await fetch(
    `/beta/tournaments/${tournamentId}/rounds/${roundId}/round_data`,
    {
      method: "GET",
    },
  );

  const data = (await response.json()) as RoundData;
  globalMessages.warnings = data.warnings ?? [];

  return data;
}

export interface RoundData {
  tournament: Tournament;
  stage: Stage;
  round: Round;
  policy?: TournamentPolicies;
  warnings?: string[];
}
