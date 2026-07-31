# frozen_string_literal: true

module Api
  module V1
    module Private
      # Base controller for private API endpoints.
      class PrivateApiController < ActionController::API
        include Graphiti::Rails::Responders

        before_action :authenticate_user!

        def current_user
          @current_user ||= load_current_user
        end

        def user_signed_in?
          !!current_user
        end

        def load_current_user
          id = session[:user_id]
          return nil unless id

          User.find_by(id:)
        end

        private

        def authenticate_user!
          return if user_signed_in?

          render json: {
            errors: [
              {
                status: '401',
                title: 'Unauthorized',
                detail: 'You must be logged in to access this resource.'
              }
            ]
          }, status: :unauthorized
        end
      end
    end
  end
end
