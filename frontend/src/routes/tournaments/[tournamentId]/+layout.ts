import { authStore } from "$lib/utils/auth.svelte";
import { loadPlayerByUserId, loadTournament } from "../api_helper";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
  const user = await authStore.checkAuth(fetch);

  return {
    tournament: await loadTournament(parseInt(params.tournamentId), fetch),
    player: user ? await loadPlayerByUserId(parseInt(params.tournamentId), user.id, fetch) : null,
  };
}
