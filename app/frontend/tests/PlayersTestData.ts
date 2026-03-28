import { DeckVisibility, Tournament } from "../pairings/PairingsData";
import type { Player, PlayersData } from "../players/PlayersData";

export const MockPlayerAlice: Player = {
  id: 1,
  name: "Alice",
  pronouns: "she/her",
  name_with_pronouns: "",
  user_id: 1,
  corp_id: {
    name: "A Teia: IP Recovery",
    faction: null,
  },
  runner_id: {
    name: "Arissana Rocha Nahu: Street Artist",
    faction: null,
  },
  registration_locked: false,
  include_in_stream: true,
  active: null,
  first_round_bye: false,
  manual_seed: null,
  fixed_table_number: null,
  side: "corp",
  side_label: null,
};

export const MockPlayerBob: Player = {
  id: 2,
  name: "Bob",
  pronouns: "he/him",
  name_with_pronouns: "",
  user_id: 2,
  corp_id: {
    name: "BANGUN: When Disaster Strikes",
    faction: null,
  },
  runner_id: {
    name: "Barry “Baz” Wong: Tri-Maf Veteran",
    faction: null,
  },
  registration_locked: true,
  include_in_stream: false,
  active: null,
  first_round_bye: true,
  manual_seed: null,
  fixed_table_number: 1,
  side: "runner",
  side_label: null,
};

export const MockTournament: Tournament = {
  id: 1,
  name: "Mock Tournament",
  player_meeting: false,
  registration_open: true,
  registration_unlocked: true,
  self_registration: true,
  nrdb_deck_registration: true,
  swiss_deck_visibility: DeckVisibility.Private,
  cut_deck_visibility: DeckVisibility.Private,
  locked_players: 0,
  unlocked_players: 2,
  allow_streaming_opt_out: true,
  manual_seed: false,
};

export const MockPlayersData: PlayersData = {
  tournament: MockTournament,
  tournamentPolicies: {
    update: true,
    custom_table_numbering: false,
  },
  activePlayers: [MockPlayerAlice, MockPlayerBob],
  droppedPlayers: [],
};
