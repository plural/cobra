# frozen_string_literal: true

module Beta
  class PlayersController < ApplicationController
    before_action :set_tournament

    def index
      authorize @tournament, :update?
    end

    def players_data
      authorize @tournament, :update?

      players = @tournament.players.active.sort_by { |p| p.name.downcase || '' }
      dropped = @tournament.players.dropped.sort_by { |p| p.name.downcase || '' }

      render json: {
        activePlayers: players.map do |player|
          helpers.player_json(player)
        end,
        droppedPlayers: dropped.map do |player|
          helpers.player_json(player)
        end
      }
    end
  end
end
