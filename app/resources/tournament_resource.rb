# frozen_string_literal: true

# Public resource for Tournament objects.
class TournamentResource < ApplicationResource
  primary_endpoint '/tournaments', %i[index show]

  self.default_page_size = 3

  attribute :id, :integer
  attribute :name, :string

  attribute :created_at, :datetime
  attribute :updated_at, :datetime

  attribute :abr_code, :string
  attribute :date, :date
  attribute :slug, :string

  attribute :private, :boolean

  attribute :tournament_type_id, :integer
  attribute :stage, :string

  # TODO(plural): What is previous_id?
  #  previous_id: nil,

  # TODO(plural): Replace this with an NRDB username
  attribute :user_id, :integer
  attribute :tournament_organizer, :string do
    @object.user&.nrdb_username
  end

  attribute :stream_url, :string
  attribute :manual_seed, :boolean
  attribute :self_registration, :boolean
  attribute :nrdb_deck_registration, :boolean
  attribute :all_players_unlocked, :boolean
  attribute :any_player_unlocked, :boolean
  attribute :registration_closed, :boolean
  attribute :swiss_deck_visibility, :string
  attribute :cut_deck_visibility, :string
  attribute :allow_streaming_opt_out, :boolean
  attribute :swiss_format, :string
  attribute :format_id, :integer
  attribute :deckbuilding_restriction_id, :string
  attribute :registration_starts, :string
  attribute :tournament_starts, :string
  attribute :decklist_required, :boolean
  attribute :organizer_contact, :string
  attribute :event_link, :string
  attribute :description, :string
  attribute :additional_prizes_description, :string
  attribute :official_prize_kit_id, :integer
  attribute :card_set_id, :string
  attribute :time_zone, :string
  attribute :allow_self_reporting, :boolean

  belongs_to :tournament_type
  belongs_to :user
end
