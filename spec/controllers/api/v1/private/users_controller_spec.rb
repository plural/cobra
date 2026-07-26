# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::Private::UsersController do
  let!(:user) { create(:user, nrdb_id: 123, nrdb_username: 'test_user') }

  describe 'GET #show' do
    context 'when authenticated' do
      before do
        session[:user_id] = user.id
      end

      it 'returns 200 OK and JSON:API payload containing user details' do
        get :show, format: :jsonapi

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

        json = JSON.parse(response.body) # rubocop:disable Rails/ResponseParsedBody
        expect(json['data']['id']).to eq(user.id.to_s)
        expect(json['data']['attributes']['nrdb_id']).to eq(123)
        expect(json['data']['attributes']['nrdb_username']).to eq('test_user')
      end
    end

    context 'when unauthenticated' do
      before do
        session[:user_id] = nil
      end

      it 'returns 401 Unauthorized with JSON:API error payload' do
        get :show, format: :jsonapi

        expect(response).to have_http_status(:unauthorized)
        expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

        json = JSON.parse(response.body) # rubocop:disable Rails/ResponseParsedBody
        expect(json).to have_key('errors')
        expect(json['errors']).to be_an(Array)
        expect(json['errors'].first['status']).to eq('401')
        expect(json['errors'].first['title']).to eq('Unauthorized')
      end
    end
  end
end
