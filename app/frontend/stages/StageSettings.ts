declare const Routes: {
  settings_tournament_stage_path: (tournamentId: number, stageId: number) => string;
  tournament_stage_path: (tournamentId: number, stageId: number) => string;
};

export type Errors = Record<string, string[]>;

export interface Stage {
  id: number;
  tournament_id: number;
  number: number;
  format: string | null;
  table_ranges: TableRange[];
}

export interface TableRange {
  id?: number;
  stage_id: number;
  first_table: number;
  last_table: number;
}

export interface StageData {
  stage: Stage;
  csrf_token: string;
}

export interface SaveStageResponse {
  id: number;
  name: string;
  url: string;
}

// TODO: Can this be merged with SaveStageResponse?
export interface SaveStageErrorResponse {
  errors: Errors;
}

export class ValidationError extends Error {
  constructor(public errors: Errors) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export async function loadStage(tournamentId: number, stageId: number): Promise<StageData> {
  const response = await fetch(Routes.settings_tournament_stage_path(tournamentId, stageId), {
    headers: { Accept: "application/json" },
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status.toString()}: ${response.statusText}`,
    );
  }

  return (await response.json()) as StageData;
}

export async function saveStage(csrfToken: string, tournamentId: number, stage: Stage): Promise<SaveStageResponse> {
  const response = await fetch(Routes.tournament_stage_path(tournamentId, stage.id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ stage }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData = (await response.json()) as SaveStageErrorResponse;
      throw new ValidationError(errorData.errors);
    }
    throw new Error(
      `HTTP ${response.status.toString()}: ${response.statusText}`,
    );
  }

  return (await response.json()) as SaveStageResponse;
}
