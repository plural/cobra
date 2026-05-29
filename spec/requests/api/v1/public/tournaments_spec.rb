# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public API Tournaments' do
  let!(:user) { create(:user) }
  let!(:tournament_type) { create(:tournament_type, name: 'Megacity Championship') }
  let!(:tournament) do
    create(:tournament, name: 'Summer Open', user: user, tournament_type: tournament_type, private: false)
  end

  describe 'GET /api/v1/public/tournaments/:id' do
    it 'returns a successful 200 response with tournament details (a match)' do
      expect_json_api_match("/api/v1/public/tournaments/#{tournament.id}", tournament.id, name: 'Summer Open')
    end

    it 'ensures relationship links are present in the JSON response' do
      expect_json_api_relationships(
        "/api/v1/public/tournaments/#{tournament.id}",
        tournament_type: '/api/v1/public/tournament_types/',
        user: '/api/v1/public/users/'
      )
    end

    it 'returns a 404 not found error response (a missing record)' do
      expect_json_api_missing('/api/v1/public/tournaments/999999')
    end
  end
end
