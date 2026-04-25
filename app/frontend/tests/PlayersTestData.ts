import type { Player, PlayersData } from "../players/PlayersData";
import { MockTournament } from "./TournamentTestData";

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
    faction: "weyland-consortium",
  },
  runner_id: {
    name: "Barry “Baz” Wong: Tri-Maf Veteran",
    faction: "criminal",
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

export const MockPlayersData: PlayersData = {
  tournament: MockTournament,
  tournamentPolicies: {
    update: true,
    custom_table_numbering: false,
  },
  activePlayers: [MockPlayerAlice, MockPlayerBob],
  droppedPlayers: [],
};
