# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::Private::UserTournamentsController do
  let!(:user1) { create(:user) }
  let!(:user2) { create(:user) }

  let!(:user1_public_tournament) { create(:tournament, user: user1, private: false) }
  let!(:user1_private_tournament) { create(:tournament, user: user1, private: true) }
  let!(:user2_public_tournament) { create(:tournament, user: user2, private: false) }
  let!(:user2_private_tournament) { create(:tournament, user: user2, private: true) }

  describe 'GET #index' do
    context 'when authenticated' do
      before do
        session[:user_id] = user1.id
      end

      it 'returns 200 OK and all tournaments owned by current user' do
        get :index, format: :jsonapi

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

        json = JSON.parse(response.body) # rubocop:disable Rails/ResponseParsedBody
        tournament_ids = json['data'].map { |t| t['id'] } # rubocop:disable Rails/Pluck

        expect(tournament_ids).to contain_exactly(
          user1_public_tournament.id.to_s,
          user1_private_tournament.id.to_s
        )
        expect(tournament_ids).not_to include(
          user2_public_tournament.id.to_s,
          user2_private_tournament.id.to_s
        )
      end
    end

    context 'when unauthenticated' do
      before do
        session[:user_id] = nil
      end

      it 'returns 401 Unauthorized' do
        get :index, format: :jsonapi

        expect(response).to have_http_status(:unauthorized)
        expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

        json = JSON.parse(response.body) # rubocop:disable Rails/ResponseParsedBody
        expect(json).to have_key('errors')
        expect(json['errors'].first['status']).to eq('401')
      end
    end
  end
end
