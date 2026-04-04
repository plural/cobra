module Beta
  # frozen_string_literal: true

  class HomeController < ApplicationController
    def help
      skip_authorization
    end
  end
end
