export interface RoundTimer {
  show: boolean;
  running: boolean;
  paused: boolean;
  started: boolean;
  state: {
    started: boolean;
    paused: boolean;
    finish_time?: string;
    remaining_seconds?: number;
    length_minutes?: number;
  }
}
