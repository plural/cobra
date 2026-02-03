# frozen_string_literal: true

require 'net/http'
require 'json'

namespace :restrictions do
  desc 'update deckbuilding restrictions'
  task update: :environment do
    puts 'Updating deckbuilding restrictions from NetrunnerDB...'
    puts "DB currently has #{DeckbuildingRestriction.count} restrictions."
    # TODO(plural): Make configuration for the V3 API URL
    uri = URI('https://api.netrunnerdb.com/api/v3/public/restrictions?filter[format_id]=standard,eternal,startup&fields[restrictions]=name,format_id,date_start&page[size]=1000')
    response = JSON.parse(Net::HTTP.get(uri))

    restrictions = response['data']
    restrictions.each do |r|
      DeckbuildingRestriction.find_or_create_by(id: r['id'])
                             .update(
                               name: r['attributes']['name'],
                               date_start: r['attributes']['date_start'],
                               play_format_id: r['attributes']['format_id']
                             )
    end
    puts "DB now has #{DeckbuildingRestriction.count} restrictions."
  end
end
