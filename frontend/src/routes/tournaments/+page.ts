import { loadTournaments } from "./api_helper";

// TODO: Use fetch parameter
export const load = async () => {
  return {
    tournamentsResponse: await loadTournaments(),
  };
}
