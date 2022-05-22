# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  prepend_before_action :set_return_to, only: [:new] # rubocop:disable Rails/LexicallyScopedActionFilter

  private

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end
end
