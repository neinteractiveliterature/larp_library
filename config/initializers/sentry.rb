# frozen_string_literal: true
if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    config.dsn = ENV.fetch("SENTRY_DSN")
    config.release = "larp-library-#{ENV.fetch("REVISION")}" if ENV["REVISION"].present?
    config.environment = ENV["SENTRY_ENV"].presence || Rails.env

    config.traces_sample_rate = ENV.fetch("SENTRY_TRACES_SAMPLE_RATE", "0").to_f
  end
end
