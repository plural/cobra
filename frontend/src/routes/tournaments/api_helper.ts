import { COBRA_API_SERVER } from "$app/env/public";
import type { TournamentsResponse } from "$lib/utils/api_types";
import { globalMessages } from "$lib/utils/GlobalMessageState.svelte";

export async function loadTournaments(url: string, altFetch = fetch): Promise<TournamentsResponse> {
  try {
    const response = await altFetch(url, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    return (await response.json()) as TournamentsResponse;
  } catch (e) {
    const err = e as Error;
    globalMessages.errors.push(`Failed to load tournaments: ${err.message}`);
  }

  return {
    data: []
  };
}

export function tournamentsApiUrl(tournamentTypeId?: string): string {
  const query = [
    `${COBRA_API_SERVER}/api/v1/public/tournaments?page[size]=10`,
    "include=tournament_type",
    "sort=-date,name",
  ];

  if (tournamentTypeId && tournamentTypeId.length > 0) {
    query.push(`filter[tournament_type_id]=${tournamentTypeId}`);
  }

  return query.join("&");
}
