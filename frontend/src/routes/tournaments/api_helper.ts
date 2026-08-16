import { COBRA_API_SERVER } from "$app/env/public";
import type { IdentityNames } from "$lib/model/Identity";
import type { Player } from "$lib/model/Player";
import { Tournament, type FeatureFlags, type TournamentOptions } from "$lib/model/Tournament";
import type { TournamentsResponse, TournamentsResponseSingle } from "$lib/utils/api_types";
import { ValidationError, type Errors } from "$lib/utils/errors";
import { globalMessages } from "$lib/utils/GlobalMessageState.svelte";

export interface TournamentSettingsData {
  tournament: Tournament;
  options: TournamentOptions;
  feature_flags: FeatureFlags;
  csrf_token: string;
}

export interface TournamentCreateResponse {
  id: number;
  name: string;
  url: string;
}

export interface TournamentCreateErrorResponse {
  errors: Errors;
}

export async function loadTournament(tournamentId: number, altFetch = fetch) {
  const response = await altFetch(
    `${COBRA_API_SERVER}/api/v1/public/tournaments/${tournamentId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    },
  );

  const apiTournament = (await response.json()) as TournamentsResponseSingle;
  const tournament = apiTournament.data?.attributes;
  if (apiTournament.data && tournament)
  {
    tournament.id = parseInt(apiTournament.data.id);
  }
  else
  {
    globalMessages.errors.push(`A tournament with ID ${tournamentId} was not found or does not exist.`);
  }

  return tournament;
}

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
    data: [],
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

export async function loadNewTournament(
  fetch: typeof globalThis.fetch,
): Promise<TournamentSettingsData> {
  const response = await fetch(`${COBRA_API_SERVER}/tournaments/new_form`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`);
  }

  return (await response.json()) as TournamentSettingsData;
}

export async function createTournament(
  csrfToken: string,
  tournament: Tournament,
): Promise<TournamentCreateResponse> {
  const response = await fetch(`${COBRA_API_SERVER}/tournaments`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ tournament }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData = (await response.json()) as TournamentCreateErrorResponse;
      throw new ValidationError(errorData.errors);
    }
    throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`);
  }

  return (await response.json()) as TournamentCreateResponse;
}

export async function loadPlayerByUserId(tournamentId: number, userId: number, altFetch = fetch) {
  try {
    const response = await altFetch(
      `${COBRA_API_SERVER}/beta/tournaments/${tournamentId}/players/by_user_id/${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    return (await response.json()) as Player;
  } catch {
    globalMessages.errors.push(`Error loading player data for user ${userId}.`);
  }
  
  return null;
}

export async function loadIdentityNames() {
  const response = await fetch(`${COBRA_API_SERVER}/beta/identities`, {
    method: "GET",
  });

  return (await response.json()) as IdentityNames;
}
