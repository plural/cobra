import { COBRA_API_SERVER } from "$app/env/public";

export type Errors = Record<string, string[]>;

export interface DemoTournamentSettings {
  id?: number;
  name?: string;
  swiss_format?: string;
  num_players?: number;
  num_first_round_byes?: number;
  assign_ids?: boolean;
}

export interface DemoTournamentSettingsData {
  tournament: DemoTournamentSettings;
  csrf_token: string;
}

function getNewDemoFormUrl(): string {
  const serverOrigin = (COBRA_API_SERVER || "").replace(/\/$/, "");
  return `${serverOrigin}/tournaments/new_demo_form`;
}

function getCreateDemoUrl(): string {
  const serverOrigin = (COBRA_API_SERVER || "").replace(/\/$/, "");
  return `${serverOrigin}/tournaments/create_demo`;
}

export async function loadNewDemoTournament(): Promise<DemoTournamentSettingsData> {
  const response = await fetch(getNewDemoFormUrl(), {
    credentials: "include",
    headers: { Accept: "application/json" },
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status.toString()}: ${response.statusText}`,
    );
  }
  return (await response.json()) as DemoTournamentSettingsData;
}

export interface TournamentDemoCreateResponse {
  id: number;
  name: string;
  url: string;
}

export interface TournamentDemoCreateErrorResponse {
  errors: Errors;
}

export async function createDemoTournament(
  csrfToken: string,
  tournament: DemoTournamentSettings,
): Promise<TournamentDemoCreateResponse> {
  const response = await fetch(getCreateDemoUrl(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ tournament }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData =
        (await response.json()) as TournamentDemoCreateErrorResponse;
      throw new ValidationError(errorData.errors);
    }
    throw new Error(
      `HTTP ${response.status.toString()}: ${response.statusText}`,
    );
  }

  return (await response.json()) as TournamentDemoCreateResponse;
}

export class ValidationError extends Error {
  constructor(public errors: Errors) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export function navigateTo(url: string) {
  window.location.href = url;
}
