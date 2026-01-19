import { Tournament, type Pairing } from "../pairings/PairingsData";
import type { RoundData } from "../pairings/RoundData";
import type { ScoreReport } from "../pairings/SelfReport";

export const MockPlayer1 = {
  id: 1,
  name: "Alice",
  name_with_pronouns: "",
  side: "corp",
  user_id: 1,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};

export const MockPlayer2 = {
  id: 2,
  name: "Bob",
  name_with_pronouns: "",
  side: "runner",
  user_id: 2,
  side_label: null,
  corp_id: null,
  runner_id: null,
  include_in_stream: false,
  active: null,
};

export const MockSelfReport1: ScoreReport = {
  report_player_id: MockPlayer1.user_id,
  score1: 6,
  score2: 0,
  intentional_draw: false,
  score1_corp: 3,
  score2_corp: null,
  score1_runner: 3,
  score2_runner: null,
};

export const MockSelfReport2: ScoreReport = {
  report_player_id: MockPlayer2.user_id,
  score1: 6,
  score2: 0,
  intentional_draw: false,
  score1_corp: 3,
  score2_corp: null,
  score1_runner: 3,
  score2_runner: null,
};

export const Pairing1: Pairing = {
  id: 1,
  table_number: 1,
  table_label: "Table 1",
  policy: {
    self_report: false,
  },
  player1: MockPlayer1,
  player2: MockPlayer2,
  score1: 0,
  score1_corp: 0,
  score1_runner: 0,
  score2: 0,
  score2_corp: 0,
  score2_runner: 0,
  score_label: "",
  intentional_draw: false,
  two_for_one: false,
  self_reports: [MockSelfReport1, MockSelfReport2],
  reported: false,
  winner_game: null,
  loser_game: null,
  bracket_type: null,
  ui_metadata: {
    row_highlighted: false,
  },
};

export const MockRoundData: RoundData = {
  tournament: new Tournament(),
  policy: { update: true, custom_table_numbering: false },
  stage: {
    id: 1,
    name: "Single Sided Swiss",
    format: "single_sided_swiss",
    is_single_sided: true,
    is_elimination: false,
    view_decks: false,
    rounds: [],
  },
  round: {
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
  },
};
