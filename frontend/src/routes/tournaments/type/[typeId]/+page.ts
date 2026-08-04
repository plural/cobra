import type { RouteParams } from "./$types";
import { loadTournaments } from "../../api_helper";

// TODO: Use fetch parameter
export const load = async ({ params }: { params: RouteParams }) => {
  return {
    tournamentsResponse: await loadTournaments(params.typeId),
  };
}
