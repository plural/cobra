# frozen_string_literal: true

module Api
  module V1
    module Private
      # Controller for private User API requests.
      class UsersController < PrivateApiController
        def show
          user = ::Private::UserResource.find(id: current_user.id)
          respond_with(user)
        end
      end
    end
  end
end
