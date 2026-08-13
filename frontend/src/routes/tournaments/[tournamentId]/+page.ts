import type { PageLoad } from "./$types";
import { loadTournament } from "../api_helper";

export const load: PageLoad = async ({ params, fetch }) => {
  // TODO: Debug
  // const foo = await loadTournament(parseInt(params.tournamentId), fetch);
  // console.log(JSON.stringify(foo));

  return {
    tournament: await loadTournament(parseInt(params.tournamentId), fetch),
  };
}
