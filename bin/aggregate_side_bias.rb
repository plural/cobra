# Script to aggregate side bias data from tournament simulation result JSON files.
require 'json'

dir = ARGV[0] || '.'
totals = Hash.new(0)

Dir.glob(File.join(dir, 'tournament_simulation_results*.json')).each do |file|
  data = JSON.parse(File.read(file))
  side_bias = data.dig('top_cut', 'side_bias') || data['side_bias'] || {}
  final_round = side_bias.keys.map(&:to_i).max&.to_s
  next unless final_round

  side_bias[final_round].each do |bias, count|
    totals[bias.to_i] += count
  end
end

# Max count used to normalize histogram width.
max_count = totals.values.max.to_f
# Used to align the side bias values in the output.
max_bias_string_width = totals.values.max.to_s.length

puts 'Final Cut Round Side Bias:'
totals.keys.sort.each do |bias|
  count = totals[bias]
  bar_length = max_count > 50 ? (count / max_count * 50).round : count
  puts sprintf("  Bias %2d: %#{max_bias_string_width}d | %s", bias, count, '█' * bar_length)
end
