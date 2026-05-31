# frozen_string_literal: true

# Mode for CardSet, used by "cards up to" in tournmane setings.
class CardSet < ApplicationRecord
  has_many :tournaments
end
