# frozen_string_literal: true

module PlayersHelper
  def player_json(player, side = nil)
    {
      id: (player['id'] if player),
      name: (player['name'] if player),
      name_with_pronouns: name_with_pronouns(player),
      user_id: (player['user_id'] if player),
      corp_id: id(player, 'corp'),
      runner_id: id(player, 'runner'),
      include_in_stream: (player['include_in_stream'] if player),
      active: (player['active'] if player),
      side:,
      side_label: side.nil? ? nil : "(#{side.to_s.titleize})"
    }
  end

  def name_with_pronouns(player)
    return '(Bye)' if player.nil?

    player['pronouns'].present? ? "#{player['name']} (#{player['pronouns']})" : player['name']
  end

  def id(player, side)
    return nil if player.nil?

    {
      "name": player["#{side}_identity"],
      "faction": player["#{side}_faction"]
    }
  end
end
