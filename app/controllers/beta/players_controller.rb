# frozen_string_literal: true

module Beta
  class PlayersController < ApplicationController
    before_action :set_tournament
    before_action :set_player, only: %i[update destroy]

    def index
      authorize @tournament, :update?
    end

    def players_data
      authorize @tournament, :update?

      players = @tournament.players.active.sort_by { |p| p.name.downcase || '' }
      dropped = @tournament.players.dropped.sort_by { |p| p.name.downcase || '' }

      render json: {
        tournament: helpers.tournament_json(@tournament),
        tournamentPolicies: helpers.tournament_policies_json(@tournament),
        activePlayers: players.map do |player|
          helpers.player_json(player)
        end,
        droppedPlayers: dropped.map do |player|
          helpers.player_json(player)
        end
      }
    end

    def update
      authorize @player

      update = player_params
      update[:user_id] = current_user.id unless organiser_view?

      head :ok

      @player.update(update.except(:corp_deck, :runner_deck))
      return unless @tournament.nrdb_deck_registration?

      save_deck(update, :corp_deck, 'corp')
      save_deck(update, :runner_deck, 'runner')
    end

    def destroy
      authorize @tournament, :update?

      @player.destroy
      @tournament.update(any_player_unlocked: @tournament.unlocked_players.count.positive?,
                         all_players_unlocked: @tournament.locked_players.count.zero?)

      head :ok
    end

    private

    def set_player
      @player = Player.find(params[:id])
    end

    def player_params
      params.require(:player)
            .permit(%i[name pronouns corp_identity runner_identity corp_deck runner_deck
                       first_round_bye manual_seed include_in_stream fixed_table_number])
    end

    def organiser_view?
      params.require(:player)[:organiser_view] && @tournament.user_id == current_user.id
    end
  end
end
