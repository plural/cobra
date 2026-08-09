import type { PageLoad } from "./$types";
import { loadTournaments, tournamentsApiUrl } from "./api_helper";

// TODO: Use fetch parameter
export const load: PageLoad = async () => {
  return {
    tournamentsResponse: await loadTournaments(tournamentsApiUrl()),
  };
}
