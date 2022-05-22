# frozen_string_literal: true
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # See https://github.com/omniauth/omniauth/wiki/FAQ#rails-session-is-clobbered-after-callback-on-developer-strategy
  skip_before_action :verify_authenticity_token, only: :intercode

  def intercode
    @user = User.from_omniauth(request.env["omniauth.auth"])

    sign_in_and_redirect @user, event: :authentication
    set_flash_message(:notice, :success, kind: "Intercode") if is_navigational_format?
  end

  def failure
    redirect_to root_path
  end
end
