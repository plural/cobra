# frozen_string_literal: true

module Beta
  class StagesController < ApplicationController
    def destroy
      authorize @tournament, :update?

      @stage.destroy!

      render json: { url: tournament_rounds_path(@tournament) }, status: :ok
    end
  end
end
