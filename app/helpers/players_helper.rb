# frozen_string_literal: true

module PlayersHelper
  def player_json(player, side = nil)
    {
      id: player&.id,
      name: player&.name,
      pronouns: player&.pronouns,
      name_with_pronouns: name_with_pronouns(player),
      user_id: player&.user_id,
      corp_id: id(player, 'corp'),
      runner_id: id(player, 'runner'),
      registration_locked: player&.registration_locked?,
      include_in_stream: player&.include_in_stream,
      active: player&.active,
      first_round_bye: player&.first_round_bye,
      manual_seed: player&.manual_seed,
      side:,
      side_label: side.nil? ? nil : "(#{side.to_s.titleize})"
    }
  end

  def name_with_pronouns(player)
    return '(Bye)' if player.nil?

    player.pronouns.present? ? "#{player.name} (#{player.pronouns})" : player.name
  end

  def id(player, side)
    return nil if player.nil?

    {
      "name": player["#{side}_identity"],
      "faction": player["#{side}_faction"]
    }
  end
end
