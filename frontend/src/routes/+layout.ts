import { COBRA_API_SERVER } from "$app/env/public";
import type { TournamentTypesResponse } from "$lib/utils/api_types";

async function loadTournamentTypes(altFetch: typeof globalThis.fetch) {
  try {
    const response = await altFetch(`${COBRA_API_SERVER}/api/v1/public/tournament_types`, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = (await response.json()) as TournamentTypesResponse;
    return data.data;
  } catch {
    return [];
  }
}

export const load = async ({ fetch }) => {
	return {
    tournamentTypes: await loadTournamentTypes(fetch as typeof globalThis.fetch),
  };
};
