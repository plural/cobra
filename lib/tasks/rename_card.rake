# frozen_string_literal: true

require 'optparse'

# Example usage:
#   Dry run:     bundle exec rake card:rename[card_id,new_id]
#   Actual run:  bundle exec rake card:rename[card_id,new_id,false]
namespace :card do
  desc 'Rename an NRDB v3 API card id to a new id in all tables containing card ids.'

  task :rename, %i[card_id new_id dry_run] => [:environment] do |_t, args|
    dry_run = args[:dry_run].blank? || args[:dry_run].to_s.downcase != 'false'

    puts "Renaming card #{args[:card_id]} to #{args[:new_id]}"

    # deck_cards: nrdb_card_id
    # decks: identity_nrdb_card_id

    ActiveRecord::Base.transaction do
      # Manually update tables that reference the old card id.
      puts "Updating references from card_id #{args[:card_id]} to #{args[:new_id]} in related tables..."

      begin
        puts '    Updating deck_cards...'
        ActiveRecord::Base.connection.execute(
          ActiveRecord::Base.sanitize_sql_array(
            [
              'UPDATE deck_cards SET nrdb_card_id = :new_card_id WHERE nrdb_card_id = :old_card_id',
              { new_card_id: args[:new_id], old_card_id: args[:card_id] }
            ]
          )
        )
      rescue StandardError => e
        puts "Error updating deck_cards: #{e.message}"
        raise ActiveRecord::Rollback
      end

      begin
        puts '    Updating decks...'
        ActiveRecord::Base.connection.execute(
          ActiveRecord::Base.sanitize_sql_array(
            [
              'UPDATE decks SET identity_nrdb_card_id = :new_card_id WHERE identity_nrdb_card_id = :old_card_id',
              { new_card_id: args[:new_id], old_card_id: args[:card_id] }
            ]
          )
        )
      rescue StandardError => e
        puts "Error updating deck_cards: #{e.message}"
        raise ActiveRecord::Rollback
      end

      if dry_run
        puts 'Rolling back due to dry run...'
        raise ActiveRecord::Rollback
      end
    end
  end
end
