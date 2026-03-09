# frozen_string_literal: true

module Beta
  class TournamentsController < ApplicationController
    before_action :set_tournament, only: %i[
      open_registration close_registration lock_player_registrations unlock_player_registrations
      cut stats id_and_faction_data cut_conversion_rates
    ]
    before_action :authorize_beta_testing

    def open_registration
      authorize @tournament, :edit?

      @tournament.open_registration!

      head :ok
    end

    def close_registration
      authorize @tournament, :edit?

      @tournament.close_registration!

      head :ok
    end

    def lock_player_registrations
      authorize @tournament, :edit?

      @tournament.lock_player_registrations!

      head :ok
    end

    def unlock_player_registrations
      authorize @tournament, :edit?

      @tournament.unlock_player_registrations!

      head :ok
    end

    def cut
      authorize @tournament

      number = params[:number].to_i
      format = params[:elimination_type] == 'single' ? :single_elim : :double_elim
      return redirect_to standings_tournament_players_path(@tournament) unless [3, 4, 8, 16].include? number

      @tournament.cut_to!(format, number)

      head :ok
    end

    def stats
      authorize @tournament, :show?
    end

    def id_and_faction_data
      authorize @tournament, :show?

      data = @tournament.id_and_faction_data

      render json: { swiss: transform_stats(data), elim: transform_stats(data[:cut]) }
    end

    def cut_conversion_rates
      authorize @tournament, :show?

      render json: transform_cut_stats(@tournament.cut_conversion_rates_data)
    end

    private

    def set_tournament
      @tournament = Tournament.find(params[:id])
    end

    def transform_stats(stats)
      {
        num_players: stats[:num_players],
        corp: {
          ids: stats[:corp][:ids].keys.map do |id|
            {
              identity: {
                name: id,
                faction: stats[:corp][:ids][id][:faction]
              },
              count: stats[:corp][:ids][id][:count]
            }
          end,
          factions: stats[:corp][:factions].keys.map do |faction|
            {
              name: faction,
              count: stats[:corp][:factions][faction]
            }
          end
        },
        runner: {
          ids: stats[:runner][:ids].keys.map do |id|
            {
              identity: {
                name: id,
                faction: stats[:runner][:ids][id][:faction]
              },
              count: stats[:runner][:ids][id][:count]
            }
          end,
          factions: stats[:runner][:factions].keys.map do |faction|
            {
              name: faction,
              count: stats[:runner][:factions][faction]
            }
          end
        }
      }
    end

    def transform_cut_stats(stats)
      {
        corp: {
          ids: stats[:identities][:corp].keys.map do |id|
            {
              identity: {
                name: id,
                faction: stats[:identities][:corp][id][:faction]
              },
              numSwissPlayers: stats[:identities][:corp][id][:num_swiss_players],
              numCutPlayers: stats[:identities][:corp][id][:num_cut_players],
              cutConversion: stats[:identities][:corp][id][:cut_conversion_percentage]
            }
          end,
          factions: stats[:factions][:corp].keys.map do |faction|
            {
              name: faction,
              numSwissPlayers: stats[:factions][:corp][faction][:num_swiss_players],
              numCutPlayers: stats[:factions][:corp][faction][:num_cut_players],
              cutConversion: stats[:factions][:corp][faction][:cut_conversion_percentage]
            }
          end
        },
        runner: {
          ids: stats[:identities][:runner].keys.map do |id|
            {
              identity: {
                name: id,
                faction: stats[:identities][:runner][id][:faction]
              },
              numSwissPlayers: stats[:identities][:runner][id][:num_swiss_players],
              numCutPlayers: stats[:identities][:runner][id][:num_cut_players],
              cutConversion: stats[:identities][:runner][id][:cut_conversion_percentage]
            }
          end,
          factions: stats[:factions][:runner].keys.map do |faction|
            {
              name: faction,
              numSwissPlayers: stats[:factions][:runner][faction][:num_swiss_players],
              numCutPlayers: stats[:factions][:runner][faction][:num_cut_players],
              cutConversion: stats[:factions][:runner][faction][:cut_conversion_percentage]
            }
          end
        }
      }
    end
  end
end
