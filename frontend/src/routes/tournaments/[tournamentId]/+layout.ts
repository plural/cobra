import { authStore } from "$lib/utils/auth.svelte";
import { loadCurrentRoundTimer, loadPlayerByUserId, loadTournament } from "../api_helper";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
  const user = await authStore.checkAuth(fetch);
  const tournamentId = parseInt(params.tournamentId);

  return {
    tournamentData: await loadTournament(tournamentId, fetch),
    timer: loadCurrentRoundTimer(tournamentId),
    player: user ? await loadPlayerByUserId(tournamentId, user.id, fetch) : null,
  };
}
