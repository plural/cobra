import {
  Player,
  Tournament,
  type Pairing,
  type PairingsData,
  type Round,
} from "../pairings/PairingsData";
import type { ScoreReport } from "../pairings/SelfReport";

export const MockPlayerAlice: Player = {
  id: 1,
  name: "Alice",
  name_with_pronouns: "",
  side: null,
  user_id: null,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};

export const MockPlayerBob: Player = {
  id: 2,
  name: "Bob",
  name_with_pronouns: "",
  side: null,
  user_id: null,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};

export const Pairing1: Pairing = {
  id: 1,
  table_number: 1,
  table_label: "Table 1",
  policy: {
    self_report: false,
  },
  player1: MockPlayerAlice,
  player2: MockPlayerBob,
  score1: 0,
  score1_corp: 0,
  score1_runner: 0,
  score2: 0,
  score2_corp: 0,
  score2_runner: 0,
  score_label: "",
  intentional_draw: false,
  two_for_one: false,
  self_reports: null,
  reported: false,
  winner_game: null,
  loser_game: null,
  bracket_type: null,
  ui_metadata: {
    row_highlighted: false,
  },
};

export const Round1: Round = {
  id: 1,
  number: 1,
  completed: false,
  pairings: [Pairing1],
  pairings_reported: 0,
  length_minutes: 0,
  timer: {
    running: false,
    paused: false,
    started: false,
  },
  unpaired_players: [],
};

export const MockPairingsData: PairingsData = {
  tournament: new Tournament(),
  policy: { update: true, custom_table_numbering: false },
  stages: [
    {
      id: 1,
      name: "Swiss",
      format: "swiss",
      is_single_sided: false,
      is_elimination: false,
      view_decks: false,
      rounds: [Round1],
    },
  ],
};

export const MockSelfReport: ScoreReport = {
  report_player_id: 1,
  score1: 6,
  score2: 0,
  intentional_draw: false,
  label: "6 - 0",
  score1_corp: null,
  score2_corp: null,
  score1_runner: null,
  score2_runner: null,
};
