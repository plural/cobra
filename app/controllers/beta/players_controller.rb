# frozen_string_literal: true

module Beta
  class PlayersController < ApplicationController
    before_action :set_tournament

    def index
      authorize @tournament, :update?
    end
  end
end
