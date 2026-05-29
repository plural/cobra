# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public API Stages' do
  let!(:tournament) { create(:tournament, private: false) }
  let!(:stage) { create(:stage, tournament: tournament, number: 1, format: :swiss) }

  describe 'GET /api/v1/public/stages/:id' do
    it 'returns a successful 200 response with stage details (a match)' do
      expect_json_api_match("/api/v1/public/stages/#{stage.id}", stage.id, number: 1, format: 'swiss')
    end

    it 'ensures relationship links are present in the JSON response' do
      expect_json_api_relationships(
        "/api/v1/public/stages/#{stage.id}",
        tournament: '/api/v1/public/tournaments/',
        rounds: '/api/v1/public/rounds'
      )
    end

    it 'returns a 404 not found error response (a missing record)' do
      expect_json_api_missing('/api/v1/public/stages/999999')
    end
  end
end
