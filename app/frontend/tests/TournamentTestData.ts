import { Tournament } from "../tournaments/TournamentSettings";

export const MockTournament = new Tournament({
  id: 1,
  name: "Mock Tournament",
  slug: "ABC1",
  user_id: 1,
  tournament_organizer: "Alice",
  date: "2026-04-21",
  registration_starts: "2026-04-21T10:00:00",
  tournament_starts: "2026-04-21T11:00:00",
  self_registration: true,
  nrdb_deck_registration: true,
  all_players_unlocked: true,
  any_player_unlocked: true,
  allow_streaming_opt_out: true,
  registration_closed: false,
  active_player_count: 17,
  dropped_player_count: 1
});
