# frozen_string_literal: true

module Api
  module V1
    module Private
      # Controller for private UserTournaments API requests.
      class UserTournamentsController < PrivateApiController
        def index
          tournaments = TournamentResource.all(params, tournaments_base_scope)
          respond_with(tournaments)
        end

        private

        def tournaments_base_scope
          Tournament.includes(:deckbuilding_restriction, :format, :official_prize_kit,
                              :user).where(user_id: current_user.id)
        end
      end
    end
  end
end
