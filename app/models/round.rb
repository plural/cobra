# frozen_string_literal: true

class Round < ApplicationRecord
  belongs_to :stage, touch: true
  belongs_to :tournament, touch: true
  has_many :pairings, -> { order(:table_number) }, dependent: :destroy # rubocop:disable Rails/InverseOf
  has_many :round_timer_activations, dependent: :destroy

  default_scope { order(number: :asc) }
  scope :complete, -> { where(completed: true) }

  after_update :cache_standings!, if: proc { saved_change_to_completed? && completed? }
  delegate :cache_standings!, to: :stage

  def pair!
    Pairer.new(self).pair!
  end

  def unpaired_players
    @unpaired_players ||= tournament.players - pairings.map(&:players).flatten
  end

  def repair!
    pairings.destroy_all
    update(completed: false)
    pair!
  end

  def collated_pairings
    return pairings if pairings.count < 5

    pairings
      .in_groups_of((pairings.count / 4.0).ceil)
      .transpose
      .flatten
  end

  def timer
    RoundTimer.new(self)
  end

  def name
    "#{stage.format.humanize(capitalize: false)} round #{number}"
  end

  def current?
    self == tournament.current_stage.rounds.last
  end
end
