# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Public API Tournament Types' do
  let!(:tournament_type) { create(:tournament_type, name: 'Megacity Championship') }

  describe 'GET /api/v1/public/tournament_types/:id' do
    it 'returns a successful 200 response with tournament type details (a match)' do
      expect_json_api_match("/api/v1/public/tournament_types/#{tournament_type.id}", tournament_type.id,
                            name: 'Megacity Championship')
    end

    it 'ensures relationship links are present in the JSON response' do
      expect_json_api_relationships(
        "/api/v1/public/tournament_types/#{tournament_type.id}",
        tournaments: '/api/v1/public/tournaments'
      )
    end

    it 'returns a 404 not found error response (a missing record)' do
      expect_json_api_missing('/api/v1/public/tournament_types/999999')
    end
  end
end
