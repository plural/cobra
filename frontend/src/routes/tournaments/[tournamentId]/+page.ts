import type { PageLoad } from "./$types";
import { loadPlayerByUserId, loadTournament } from "../api_helper";
import { authStore } from "$lib/utils/auth.svelte";

export const load: PageLoad = async ({ params, fetch }) => {
  const user = await authStore.checkAuth(fetch);

  return {
    tournament: await loadTournament(parseInt(params.tournamentId), fetch),
    player: user ? await loadPlayerByUserId(parseInt(params.tournamentId), user.id, fetch) : null,
  };
}
