# frozen_string_literal: true

module Private
  # Resource for private User API requests.
  class UserResource < ApplicationResource
    self.model = User
    self.endpoint_namespace = '/api/v1/private'

    primary_endpoint '/user', %i[show]

    attribute :id, :integer
    attribute :nrdb_id, :integer
    attribute :nrdb_username, :string
  end
end
