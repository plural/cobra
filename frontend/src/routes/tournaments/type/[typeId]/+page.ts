import type { PageLoad } from "./$types";
import { loadTournaments } from "../../api_helper";

// TODO: Use fetch parameter
export const load: PageLoad = async ({ params }) => {
  return {
    tournamentsResponse: await loadTournaments(params.typeId),
  };
}
