# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public API Rounds' do
  let!(:tournament) { create(:tournament, private: false) }
  let!(:stage) { create(:stage, tournament: tournament) }
  let!(:round) { create(:round, tournament: tournament, stage: stage, number: 1, completed: false) }

  describe 'GET /api/v1/public/rounds/:id' do
    it 'returns a successful 200 response with round details (a match)' do
      expect_json_api_match("/api/v1/public/rounds/#{round.id}", round.id, number: 1, completed: false)
    end

    it 'ensures relationship links are present in the JSON response' do
      expect_json_api_relationships(
        "/api/v1/public/rounds/#{round.id}",
        stage: '/api/v1/public/stages/',
        tournament: '/api/v1/public/tournaments/'
      )
    end

    it 'returns a 404 not found error response (a missing record)' do
      expect_json_api_missing('/api/v1/public/rounds/999999')
    end
  end
end
