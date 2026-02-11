# frozen_string_literal: true

class BetaController < ApplicationController
  def set_beta
    authorize :beta, :beta_testing_enabled?

    cookies[:beta_enabled] = params.fetch(:beta_enabled, true)

    redirect_back_or_to '/'
  end
end
