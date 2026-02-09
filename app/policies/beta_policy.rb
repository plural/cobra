# frozen_string_literal: true

class BetaPolicy < ApplicationPolicy
  def beta_testing_enabled?
    Flipper.enabled?(:beta_testing, user)
  end
end
