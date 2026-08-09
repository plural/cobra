import type { PageLoad } from "./$types";
import { loadTournaments, tournamentsApiUrl } from "./api_helper";

export const load: PageLoad = async ({ fetch }) => {
  return {
    tournamentsResponse: await loadTournaments(tournamentsApiUrl(), fetch),
  };
}
