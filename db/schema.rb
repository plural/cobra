# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_07_06_040934) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: nil, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "card_sets", id: :string, force: :cascade do |t|
    t.string "name"
    t.date "date_release"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_card_sets_on_name", unique: true
  end

  create_table "custom_prizes", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "tournament_id", null: false
    t.index ["name"], name: "index_custom_prizes_on_name", unique: true
    t.index ["tournament_id"], name: "index_custom_prizes_on_tournament_id"
  end

  create_table "deck_cards", force: :cascade do |t|
    t.bigint "deck_id"
    t.string "title"
    t.integer "quantity"
    t.integer "influence"
    t.string "nrdb_card_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "nrdb_printing_id"
    t.string "card_type_id"
    t.string "faction_id"
    t.integer "influence_cost"
    t.index ["deck_id"], name: "index_deck_cards_on_deck_id"
  end

  create_table "deckbuilding_restrictions", id: :string, force: :cascade do |t|
    t.string "name"
    t.date "date_start"
    t.string "play_format_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_deckbuilding_restrictions_on_name", unique: true
  end

  create_table "decks", force: :cascade do |t|
    t.bigint "player_id"
    t.string "side_id"
    t.string "name"
    t.string "identity_title"
    t.integer "min_deck_size"
    t.integer "max_influence"
    t.string "nrdb_uuid"
    t.string "identity_nrdb_card_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "identity_nrdb_printing_id"
    t.bigint "user_id"
    t.string "faction_id"
    t.index ["player_id"], name: "index_decks_on_player_id"
    t.index ["user_id"], name: "index_decks_on_user_id"
  end

  create_table "flipper_features", force: :cascade do |t|
    t.string "key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_flipper_features_on_key", unique: true
  end

  create_table "flipper_gates", force: :cascade do |t|
    t.string "feature_key", null: false
    t.string "key", null: false
    t.text "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_key", "key", "value"], name: "index_flipper_gates_on_feature_key_and_key_and_value", unique: true
  end

  create_table "formats", force: :cascade do |t|
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_formats_on_name", unique: true
    t.index ["position"], name: "index_formats_on_position", unique: true
  end

  create_table "identities", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "side"
    t.string "faction"
    t.string "nrdb_code"
    t.string "autocomplete"
    t.index ["side"], name: "index_identities_on_side"
  end

  create_table "official_prize_kits", force: :cascade do |t|
    t.string "name", null: false
    t.string "link"
    t.string "image_url"
    t.string "description"
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_official_prize_kits_on_name", unique: true
    t.index ["position"], name: "index_official_prize_kits_on_position", unique: true
  end

  create_table "pairings", id: :serial, force: :cascade do |t|
    t.integer "round_id"
    t.integer "player1_id"
    t.integer "player2_id"
    t.integer "table_number"
    t.integer "score1"
    t.integer "score2"
    t.integer "side"
    t.integer "score1_runner"
    t.integer "score1_corp"
    t.integer "score2_corp"
    t.integer "score2_runner"
    t.datetime "created_at", precision: nil, default: -> { "now()" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "now()" }, null: false
    t.boolean "intentional_draw", default: false, null: false
    t.boolean "two_for_one", default: false, null: false
    t.index ["player1_id"], name: "index_pairings_on_player1_id"
    t.index ["player2_id"], name: "index_pairings_on_player2_id"
    t.index ["round_id"], name: "index_pairings_on_round_id"
  end

  create_table "player_match_reports", id: false, force: :cascade do |t|
    t.integer "tournament_id", null: false
    t.integer "round_id", null: false
    t.integer "pairing_id", null: false
    t.integer "player_id", null: false
    t.integer "player1_id", null: false
    t.integer "player2_id", null: false
    t.integer "score1"
    t.integer "score2"
    t.integer "side"
    t.integer "score1_runner"
    t.integer "score1_corp"
    t.integer "score2_corp"
    t.integer "score2_runner"
    t.boolean "intentional_draw", default: false, null: false
    t.boolean "two_for_one", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id", "round_id", "pairing_id", "player_id"], name: "idx_unq_id_player_match_reports", unique: true
  end

  create_table "players", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "tournament_id"
    t.boolean "active", default: true
    t.string "corp_identity"
    t.string "runner_identity"
    t.integer "seed"
    t.boolean "first_round_bye", default: false
    t.integer "previous_id"
    t.integer "manual_seed"
    t.bigint "user_id"
    t.boolean "registration_locked"
    t.string "pronouns"
    t.boolean "include_in_stream", default: true
    t.bigint "corp_identity_ref_id"
    t.bigint "runner_identity_ref_id"
    t.integer "fixed_table_number"
    t.index ["corp_identity_ref_id"], name: "index_players_on_corp_identity_ref_id"
    t.index ["runner_identity_ref_id"], name: "index_players_on_runner_identity_ref_id"
    t.index ["tournament_id", "name"], name: "idx_uniq_players_tournament_id_name", unique: true
    t.index ["tournament_id"], name: "index_players_on_tournament_id"
    t.index ["user_id"], name: "index_players_on_user_id"
  end

  create_table "registrations", id: :serial, force: :cascade do |t|
    t.integer "player_id"
    t.integer "stage_id"
    t.integer "seed"
    t.index ["player_id"], name: "index_registrations_on_player_id"
    t.index ["stage_id"], name: "index_registrations_on_stage_id"
  end

  create_table "round_timer_activations", force: :cascade do |t|
    t.bigint "tournament_id"
    t.bigint "round_id"
    t.datetime "start_time", default: -> { "now()" }, null: false
    t.datetime "stop_time"
    t.index ["round_id"], name: "index_round_timer_activations_on_round_id"
    t.index ["tournament_id"], name: "index_round_timer_activations_on_tournament_id"
  end

  create_table "rounds", id: :serial, force: :cascade do |t|
    t.integer "tournament_id", null: false
    t.integer "number"
    t.boolean "completed", default: false
    t.decimal "weight", default: "1.0"
    t.integer "stage_id"
    t.datetime "created_at", precision: nil, default: -> { "now()" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "now()" }, null: false
    t.integer "length_minutes", default: 65
    t.index ["stage_id"], name: "index_rounds_on_stage_id"
    t.index ["tournament_id"], name: "index_rounds_on_tournament_id"
  end

  create_table "self_reports", force: :cascade do |t|
    t.integer "pairing_id"
    t.integer "report_player_id"
    t.integer "score1"
    t.integer "score2"
    t.integer "score1_corp"
    t.integer "score1_runner"
    t.integer "score2_corp"
    t.integer "score2_runner"
    t.boolean "intentional_draw"
    t.index ["pairing_id"], name: "index_self_reports_on_pairings"
  end

  create_table "stages", id: :serial, force: :cascade do |t|
    t.integer "tournament_id"
    t.integer "number", default: 1
    t.integer "format", default: 0, null: false
    t.datetime "created_at", precision: nil, default: -> { "now()" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "now()" }, null: false
    t.index ["tournament_id"], name: "index_stages_on_tournament_id"
  end

  create_table "standing_rows", id: :serial, force: :cascade do |t|
    t.integer "position"
    t.integer "player_id"
    t.integer "stage_id"
    t.integer "points"
    t.decimal "sos"
    t.decimal "extended_sos"
    t.integer "corp_points"
    t.integer "runner_points"
    t.integer "bye_points", default: 0
    t.index ["player_id"], name: "index_standing_rows_on_player_id"
    t.index ["stage_id"], name: "index_standing_rows_on_stage_id"
  end

  create_table "tournament_types", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "nsg_format", default: false, null: false
    t.integer "position", default: 0, null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tournament_types_on_name", unique: true
    t.index ["position"], name: "index_tournament_types_on_position", unique: true
  end

  create_table "tournaments", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: nil
    t.string "abr_code"
    t.integer "stage", default: 0
    t.integer "previous_id"
    t.integer "user_id"
    t.string "slug"
    t.date "date"
    t.boolean "private", default: false
    t.string "stream_url"
    t.boolean "manual_seed"
    t.datetime "updated_at", precision: nil, default: -> { "now()" }, null: false
    t.boolean "self_registration"
    t.boolean "nrdb_deck_registration", default: false
    t.boolean "all_players_unlocked", default: true
    t.boolean "any_player_unlocked", default: true
    t.boolean "registration_closed"
    t.integer "swiss_deck_visibility", default: 0, null: false
    t.integer "cut_deck_visibility", default: 0, null: false
    t.boolean "allow_streaming_opt_out"
    t.integer "swiss_format", default: 0, null: false
    t.bigint "tournament_type_id"
    t.bigint "format_id"
    t.string "deckbuilding_restriction_id"
    t.string "registration_starts"
    t.string "tournament_starts"
    t.boolean "decklist_required", default: false, null: false
    t.string "organizer_contact"
    t.string "event_link"
    t.text "description"
    t.text "additional_prizes_description"
    t.bigint "official_prize_kit_id"
    t.string "card_set_id"
    t.string "time_zone"
    t.boolean "allow_self_reporting", default: false
    t.index ["card_set_id"], name: "index_tournaments_on_card_set_id"
    t.index ["deckbuilding_restriction_id"], name: "index_tournaments_on_deckbuilding_restriction_id"
    t.index ["format_id"], name: "index_tournaments_on_format_id"
    t.index ["official_prize_kit_id"], name: "index_tournaments_on_official_prize_kit_id"
    t.index ["tournament_type_id"], name: "index_tournaments_on_tournament_type_id"
    t.index ["user_id"], name: "index_tournaments_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "nrdb_id"
    t.string "nrdb_username"
    t.string "nrdb_access_token"
    t.string "nrdb_refresh_token"
    t.index ["nrdb_id"], name: "index_users_on_nrdb_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "custom_prizes", "tournaments"
  add_foreign_key "deck_cards", "decks"
  add_foreign_key "decks", "players"
  add_foreign_key "pairings", "players", column: "player1_id"
  add_foreign_key "pairings", "players", column: "player2_id"
  add_foreign_key "pairings", "rounds"
  add_foreign_key "players", "identities", column: "corp_identity_ref_id"
  add_foreign_key "players", "identities", column: "runner_identity_ref_id"
  add_foreign_key "players", "tournaments"
  add_foreign_key "players", "users"
  add_foreign_key "registrations", "players"
  add_foreign_key "registrations", "stages"
  add_foreign_key "round_timer_activations", "rounds"
  add_foreign_key "round_timer_activations", "tournaments"
  add_foreign_key "rounds", "stages"
  add_foreign_key "rounds", "tournaments"
  add_foreign_key "self_reports", "pairings"
  add_foreign_key "stages", "tournaments"
  add_foreign_key "standing_rows", "players"
  add_foreign_key "standing_rows", "stages"
  add_foreign_key "tournaments", "card_sets"
  add_foreign_key "tournaments", "deckbuilding_restrictions"
  add_foreign_key "tournaments", "formats"
  add_foreign_key "tournaments", "official_prize_kits"
  add_foreign_key "tournaments", "tournament_types"
  add_foreign_key "tournaments", "users"

  create_view "side_win_percentages", sql_definition: <<-SQL
      WITH base AS (
           SELECT s.tournament_id,
              s.number AS stage_number,
                  CASE
                      WHEN (s.format = 0) THEN 2
                      ELSE 1
                  END AS num_expected_games,
                  CASE
                      WHEN ((s.format = 0) AND ((((p.score1_corp + p.score1_runner) + p.score2_corp) + p.score2_runner) > 0)) THEN 2
                      WHEN ((s.format > 0) AND (p.side > 0) AND ((p.score1 + p.score2) > 0)) THEN 1
                      ELSE 0
                  END AS num_valid_games,
                  CASE
                      WHEN ((s.format = 0) AND (((p.score1_corp = 3) AND (p.score2_corp = 0)) OR ((p.score1_corp = 0) AND (p.score2_corp = 3)))) THEN 1
                      WHEN ((s.format = 0) AND (p.score1_corp = 3) AND (p.score2_corp = 3)) THEN 2
                      WHEN (((s.format > 0) AND (p.score1_corp = 3)) OR (p.score2_corp = 3)) THEN 1
                      ELSE 0
                  END AS num_corp_wins,
                  CASE
                      WHEN ((s.format = 0) AND (((p.score1_runner = 3) AND (p.score2_runner = 0)) OR ((p.score1_runner = 0) AND (p.score2_runner = 3)))) THEN 1
                      WHEN ((s.format = 0) AND (p.score1_runner = 3) AND (p.score2_runner = 3)) THEN 2
                      WHEN (((s.format > 0) AND (p.score1_runner = 3)) OR (p.score2_runner = 3)) THEN 1
                      ELSE 0
                  END AS num_runner_wins
             FROM ((stages s
               JOIN rounds r ON ((s.id = r.stage_id)))
               JOIN pairings p ON ((p.round_id = r.id)))
            WHERE r.completed
          ), calculated AS (
           SELECT base.tournament_id,
              base.stage_number,
              base.num_expected_games,
              base.num_valid_games,
                  CASE
                      WHEN (base.num_valid_games = 0) THEN 0
                      ELSE base.num_corp_wins
                  END AS num_corp_wins,
                  CASE
                      WHEN (base.num_valid_games = 0) THEN 0
                      ELSE base.num_runner_wins
                  END AS num_runner_wins
             FROM base
          )
   SELECT calculated.tournament_id,
      calculated.stage_number,
      sum(calculated.num_expected_games) AS num_games,
      sum(calculated.num_valid_games) AS num_valid_games,
      (
          CASE
              WHEN (sum(calculated.num_expected_games) > 0) THEN ((sum(calculated.num_valid_games))::double precision / (sum(calculated.num_expected_games))::double precision)
              ELSE (0.0)::double precision
          END * (100)::double precision) AS valid_game_percentage,
      sum(calculated.num_corp_wins) AS num_corp_wins,
      (
          CASE
              WHEN (sum(calculated.num_valid_games) > 0) THEN ((sum(calculated.num_corp_wins))::double precision / (sum(calculated.num_valid_games))::double precision)
              ELSE (0.0)::double precision
          END * (100)::double precision) AS corp_win_percentage,
      sum(calculated.num_runner_wins) AS num_runner_wins,
      (
          CASE
              WHEN (sum(calculated.num_valid_games) > 0) THEN ((sum(calculated.num_runner_wins))::double precision / (sum(calculated.num_valid_games))::double precision)
              ELSE (0.0)::double precision
          END * (100)::double precision) AS runner_win_percentage
     FROM calculated
    GROUP BY calculated.tournament_id, calculated.stage_number
    ORDER BY calculated.tournament_id, calculated.stage_number;
  SQL
  create_view "cut_conversion_rates", sql_definition: <<-SQL
      WITH corps AS (
           SELECT s_1.tournament_id,
              s_1.number AS stage_number,
              s_1.id AS stage_id,
              'corp'::text AS side,
              COALESCE(id.name, 'Unspecified'::character varying) AS identity,
              COALESCE(id.faction, 'Unspecified'::character varying) AS faction
             FROM (((stages s_1
               JOIN registrations r ON ((s_1.id = r.stage_id)))
               JOIN players p ON ((r.player_id = p.id)))
               LEFT JOIN identities id ON ((p.corp_identity_ref_id = id.id)))
          ), runners AS (
           SELECT s_1.tournament_id,
              s_1.number AS stage_number,
              s_1.id AS stage_id,
              'runner'::text AS side,
              COALESCE(id.name, 'Unspecified'::character varying) AS identity,
              COALESCE(id.faction, 'Unspecified'::character varying) AS faction
             FROM (((stages s_1
               JOIN registrations r ON ((s_1.id = r.stage_id)))
               JOIN players p ON ((r.player_id = p.id)))
               LEFT JOIN identities id ON ((p.runner_identity_ref_id = id.id)))
          ), combined AS (
           SELECT corps.tournament_id,
              corps.stage_number,
              corps.stage_id,
              corps.side,
              corps.identity,
              corps.faction
             FROM corps
          UNION ALL
           SELECT runners.tournament_id,
              runners.stage_number,
              runners.stage_id,
              runners.side,
              runners.identity,
              runners.faction
             FROM runners
          ), swiss AS (
           SELECT combined.tournament_id,
              combined.stage_id,
              combined.stage_number,
              combined.side,
              combined.identity,
              combined.faction,
              count(*) AS num_players
             FROM combined
            WHERE (combined.stage_number = 1)
            GROUP BY combined.tournament_id, combined.stage_id, combined.stage_number, combined.side, combined.identity, combined.faction
          ), cut AS (
           SELECT combined.tournament_id,
              combined.stage_id,
              combined.stage_number,
              combined.side,
              combined.identity,
              combined.faction,
              count(*) AS num_players
             FROM combined
            WHERE (combined.stage_number = 2)
            GROUP BY combined.tournament_id, combined.stage_id, combined.stage_number, combined.side, combined.identity, combined.faction
          )
   SELECT s.tournament_id,
      s.side,
      s.faction,
      s.identity,
      sum(s.num_players) AS num_swiss_players,
      sum(COALESCE(c.num_players, (0)::bigint)) AS num_cut_players,
      ((sum(COALESCE(c.num_players, (0)::bigint)) / sum(s.num_players)) * (100)::numeric) AS cut_conversion_percentage
     FROM (swiss s
       LEFT JOIN cut c USING (tournament_id, side, identity, faction))
    GROUP BY s.tournament_id, s.faction, s.side, s.identity;
  SQL
end
