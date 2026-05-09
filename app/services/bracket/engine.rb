# frozen_string_literal: true

module Bracket
  module Engine # rubocop:disable Style/Documentation
    def self.included(base)
      base.extend ClassMethods
    end

    SeedRef = Struct.new(:seed_position) do
      def call(context) = context.seed(seed_position)
    end

    SeedOf = Struct.new(:players, :seed_position) do
      def call(context) = context.seed_of(players, seed_position)
    end

    module ClassMethods # rubocop:disable Style/Documentation
      def game(number, p1, p2, options = {}) # rubocop:disable Naming/MethodParameterName
        class_eval do
          @games ||= []
          @games << {
            number:,
            player1: p1,
            player2: p2,
            round: options[:round],
            winner_game: options[:winner_game],
            loser_game: options[:loser_game],
            bracket_type: options[:bracket_type],
            player1_seed: p1.respond_to?(:seed_position) ? p1.seed_position : nil,
            player2_seed: p2.respond_to?(:seed_position) ? p2.seed_position : nil
          }
        end
      end

      def seed(pos)
        SeedRef.new(pos)
      end

      def seed_of(players, pos)
        SeedOf.new(players, pos)
      end

      %w[winner loser winner_if_also_winner loser_if_also_winner].each do |method|
        define_method method do |*args|
          args.unshift(method)
          ->(context) { context.send(*args) }
        end
      end
    end

    def games
      self.class.instance_variable_get(:@games)
    end

    def games_for_round(number)
      games.select { |g| g[:round] == number }
    end
  end
end
