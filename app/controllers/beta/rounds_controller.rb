# frozen_string_literal: true

class Beta::RoundsController < ApplicationController
  before_action :set_tournament
  # before_action :set_round, only: %i[edit update destroy repair complete update_timer]

  def index
    authorize @tournament, :update?
    @stages = @tournament.stages.includes(
      :tournament, rounds: [:tournament, :stage, { pairings: %i[tournament stage round self_reports player1 player2] }]
    )
    @players = @tournament.players
                          .includes(:corp_identity_ref, :runner_identity_ref)
                          .index_by(&:id).merge({ nil => NilPlayer.new })
    @warning = @tournament.current_stage&.validate_table_count
  end
end