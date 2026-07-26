# frozen_string_literal: true

module Api
  module V1
    module Private
      # Controller for private UserTournaments API requests.
      class UserTournamentsController < PrivateApiController
        def index
          tournaments = TournamentResource.all(params, Tournament.where(user_id: current_user.id))
          respond_with(tournaments)
        end
      end
    end
  end
end
