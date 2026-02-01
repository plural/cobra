# frozen_string_literal: true

require 'net/http'
require 'json'

namespace :card_sets do
  desc 'update card sets'
  task update: :environment do
    puts 'Updating card sets from NetrunnerDB...'
    puts "DB currently has #{CardSet.count} card sets."
    # TODO(plural): Make configuration for the V3 API URL
    uri = URI('https://api.netrunnerdb.com/api/v3/public/card_sets')
    response = JSON.parse(Net::HTTP.get(uri))

    card_sets = response['data']
    card_sets.each do |card_set|
      CardSet.find_or_create_by(id: card_set['id'])
             .update(
               name: card_set['attributes']['name'],
               date_release: card_set['attributes']['date_release']
             )
    end
    puts "DB now has #{CardSet.count} card sets."
  end
end
