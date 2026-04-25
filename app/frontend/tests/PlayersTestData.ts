import type { IdentityNames } from "../identities/Identity";
import type { Player, PlayersData } from "../players/PlayersData";
import { Tournament } from "../tournaments/TournamentSettings";

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

export const MockTournament = new Tournament({
  id: 1,
  name: "Mock Tournament",
  self_registration: true,
  nrdb_deck_registration: true,
  all_players_unlocked: true,
  any_player_unlocked: true,
  allow_streaming_opt_out: true,
});

export const MockPlayersData: PlayersData = {
  tournament: MockTournament,
  tournamentPolicies: {
    update: true,
    custom_table_numbering: false,
  },
  activePlayers: [MockPlayerAlice, MockPlayerBob],
  droppedPlayers: [],
};

export const MockIdentityNames: IdentityNames = {
  corp: [
    {
      label: "A Teia: IP Recovery",
      value: "A Teia: IP Recovery",
    },
    {
      label: "BANGUN: When Disaster Strikes",
      value: "BANGUN: When Disaster Strikes",
    },
  ],
  runner: [
    {
      label: "Arissana Rocha Nahu: Street Artist",
      value: "Arissana Rocha Nahu: Street Artist",
    },
    {
      label: "Barry “Baz” Wong: Tri-Maf Veteran",
      value: "Barry “Baz” Wong: Tri-Maf Veteran",
    },
  ],
};
