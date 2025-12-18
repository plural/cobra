# frozen_string_literal: true

module Beta
  class PairingsController < ApplicationController
    before_action :set_tournament
    attr_reader :tournament

    def destroy
      authorize @tournament, :update?

      pairing.destroy

      render json: { url: tournament_round_path(tournament, round) }, status: :ok
    end

    def report
      authorize @tournament, :update?

      save_report

      render json: { url: tournament_rounds_path(@tournament) }, status: :ok
    end

    def reset_self_report
      authorize @tournament, :update?

      SelfReport.where(pairing_id: pairing.id).destroy_all

      render json: { url: tournament_rounds_path(@tournament) }, status: :ok
    end
  end
end
