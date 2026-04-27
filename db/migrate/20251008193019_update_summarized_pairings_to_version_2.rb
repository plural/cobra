# frozen_string_literal: true

class UpdateSummarizedPairingsToVersion2 < ActiveRecord::Migration[7.2]
  def change
    update_view :summarized_pairings, version: 2, revert_to_version: 1
  end
end
