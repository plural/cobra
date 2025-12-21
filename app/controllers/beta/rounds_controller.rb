# frozen_string_literal: true

module Beta
  class RoundsController < ApplicationController
    before_action :set_tournament
    before_action :set_round, only: %i[complete]

    def index
      authorize @tournament, :update?
      @stages = @tournament.stages.includes(
        tournament:,
        rounds: [:tournament, :stage, { pairings: %i[tournament stage round self_reports player1 player2] }]
      )
      @players = @tournament.players
                            .includes(:corp_identity_ref, :runner_identity_ref)
                            .index_by(&:id).merge({ nil => NilPlayer.new })
      @warning = @tournament.current_stage&.validate_table_count
    end

    def complete
      authorize @tournament, :update?

      @round.update!(completed: params[:completed])
      @round.timer.stop!

      render json: { url: tournament_rounds_path(@tournament) }, status: :ok
    end

    def update_timer
      authorize @tournament, :update?

      @round.update!(length_minutes: params[:length_minutes])

      case params[:operation]
      when 'start'
        @round.timer.start!
      when 'stop'
        @round.timer.stop!
      when 'reset'
        @round.timer.reset!
      end

      render json: { url: tournament_rounds_path(@tournament) }, status: :ok
    end

    def set_round
      @round = Round.find(params[:id])
    end
  end
end
