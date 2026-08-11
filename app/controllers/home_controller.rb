# frozen_string_literal: true

class HomeController < ApplicationController # rubocop:disable Style/Documentation
  def home
    authorize Tournament, :index?

    @tournaments = Tournament.includes(:user, :tournament_type).where(date: Date.current, private: false)
  end

  def help
    skip_authorization
  end
end
