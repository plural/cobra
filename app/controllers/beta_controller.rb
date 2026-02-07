# frozen_string_literal: true

class BetaController < ApplicationController
  def set_beta
    skip_authorization

    cookies[:beta_enabled] = params.fetch(:beta_enabled, true)

    redirect_back_or_to '/'
  end
end
