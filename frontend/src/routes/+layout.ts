import { COBRA_API_SERVER } from "$app/env/public";
import type { TournamentTypeInfo, TournamentTypesResponse } from "$lib/utils/api_types";

export interface LayoutProps {
  tournamentTypes: TournamentTypeInfo[];
}

async function loadTournamentTypes() {
  try {
    const response = await fetch(`${COBRA_API_SERVER}/api/v1/public/tournament_types`, {
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

export const load = async (): Promise<LayoutProps> => {
	return {
    tournamentTypes: await loadTournamentTypes(),
  };
};
