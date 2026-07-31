# frozen_string_literal: true

class OauthController < ApplicationController # rubocop:disable Style/Documentation
  before_action :skip_authorization

  def auth
    session[:return_to] = params[:return_to]
    redirect_to Nrdb::Oauth.auth_uri(request.host), allow_other_host: true
  end

  def logout
    session[:user_id] = nil

    target_url = sanitize_return_to(params[:return_to])
    redirect_to target_url, allow_other_host: true
  end

  def callback
    if callback_code
      token_data = Nrdb::Oauth.get_access_token(callback_code)

      user_data = Nrdb::Connection.new(nil, token_data[:access_token]).player_info.first

      user = User.find_or_create_by(nrdb_id: user_data[:id])
      user.update(
        nrdb_username: user_data[:username],
        nrdb_access_token: token_data[:access_token],
        nrdb_refresh_token: token_data[:refresh_token]
      )

      session[:user_id] = user.id

      target_url = sanitize_return_to(session.delete(:return_to))
      redirect_to target_url, allow_other_host: true
    else
      render json: { message: :failed }, status: :internal_server_error
    end
  end

  private

  def sanitize_return_to(url)
    return root_path if url.blank?

    begin
      uri = URI.parse(url.to_s)
      if uri.relative? || allowed_redirect_host?(uri.host)
        url
      else
        root_path
      end
    rescue URI::InvalidURIError
      root_path
    end
  end

  def allowed_redirect_host?(host)
    return true if host.blank?
    return true if Rails.env.local?

    host == request.host
  end

  def callback_code
    params.require(:code)
  end
end
