# frozen_string_literal: true

class CreateSummarizedPairings < ActiveRecord::Migration[7.2]
  def change
    create_view :summarized_pairings
  end
end
