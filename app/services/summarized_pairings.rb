# frozen_string_literal: true

require 'graph_matching'

class SummarizedPairings
  def self.for_user_in_tournament(user_id, tournament_id)
    sql = ActiveRecord::Base.sanitize_sql(
      [
        'SELECT * FROM summarized_pairings WHERE tournament_id = ? AND (player1_user_id = ? OR player2_user_id = ?) '\
        'ORDER BY stage_number, round_number',
        tournament_id, user_id, user_id
      ]
    )
    rows = ActiveRecord::Base.connection.exec_query(sql).to_a

    corp_id = { name: nil, faction: nil }
    runner_id = { name: nil, faction: nil }
    pairings = []

    rows.each do |row|
      player_prefix = row['player1_user_id'] == user_id ? 'player1_' : 'player2_'
      corp_id = { name: row["#{player_prefix}corp_identity"], faction: row["#{player_prefix}corp_faction"] }
      runner_id = { name: row["#{player_prefix}runner_identity"], faction: row["#{player_prefix}runner_faction"] }

      pairings << {
        stage_id: row['stage_id'],
        stage_number: row['stage_number'],
        format: Stage.formats.invert[row['stage_format']],
        round_number: row['round_number'],
        round_completed: row['round_completed'],
        pairing_id: row['pairing_id'],
        table_number: row['table_number'],
        side: row['side'],
        player1_user_id: row['player1_user_id'],
        player1_name: row['player1_name'],
        player1_pronouns: row['player1_pronouns'],
        player1_corp_identity: row['player1_corp_identity'],
        player1_corp_faction: row['player1_corp_faction'],
        player1_runner_identity: row['player1_runner_identity'],
        player1_runner_faction: row['player1_runner_faction'],
        player2_user_id: row['player2_user_id'],
        player2_name: row['player2_name'],
        player2_pronouns: row['player2_pronouns'],
        player2_corp_identity: row['player2_corp_identity'],
        player2_corp_faction: row['player2_corp_faction'],
        player2_runner_identity: row['player2_runner_identity'],
        player2_runner_faction: row['player2_runner_faction'],
        score1: row['score1'],
        score2: row['score2'],
        score1_corp: row['score1_corp'],
        score1_runner: row['score1_runner'],
        score2_corp: row['score2_corp'],
        score2_runner: row['score2_runner'],
        intentional_draw: row['intentional_draw'],
        two_for_one: row['two_for_one']
      }
    end

    output = {
      tournament_id: tournament_id,
      user_id: user_id
    }
    unless rows.empty?
      output[:identities] = {
        corp: corp_id,
        runner: runner_id
      }
      output[:pairings] = pairings
    end
    output
  end
end
