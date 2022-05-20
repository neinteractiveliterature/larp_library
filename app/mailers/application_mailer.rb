# frozen_string_literal: true
class ApplicationMailer < ActionMailer::Base
  include AbsoluteUrls
  helper_method :absolute_url

  default from: "noreply@larplibrary.org"
  layout "mailer"
end
