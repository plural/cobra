declare const Routes: {
  settings_tournament_stage_path: (tournamentId: number, routeId: number) => string;
};

export type Errors = Record<string, string[]>;

export interface Stage {
  id: number;
  format: string | null;
  table_ranges: TableRange[];
}

export interface TableRange {
  id: number;
  first_table: number;
  last_table: number;
}

export interface StageData {
  stage: Stage;
  csrf_token: string;
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
