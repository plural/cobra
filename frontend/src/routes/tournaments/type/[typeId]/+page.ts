import type { PageLoad } from "./$types";
import { loadTournaments, tournamentsApiUrl } from "../../api_helper";

export const load: PageLoad = async ({ params, fetch }) => {
  return {
    tournamentsResponse: await loadTournaments(tournamentsApiUrl(params.typeId), fetch),
  };
}
