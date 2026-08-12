import type { PageLoad } from "./$types";
import { loadNewTournament } from "../api_helper";

export const load: PageLoad = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
  return {
    tournamentSettings: await loadNewTournament(fetch),
  };
};
