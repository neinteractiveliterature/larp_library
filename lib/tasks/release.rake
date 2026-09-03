# frozen_string_literal: true
# rubocop:disable Metrics/BlockLength

namespace :release do
  desc "Notify Sentry of a release"
  task :notify do # rubocop:disable Rails/RakeEnvironment
    raise "SENTRY_ORGANIZATION_ID must be set" unless ENV["SENTRY_ORGANIZATION_ID"]
    raise "SENTRY_RELEASE_TOKEN must be set" unless ENV["SENTRY_RELEASE_TOKEN"]
    raise "REVISION must be set" unless ENV["REVISION"]

    require "net/http"
    require "json"

    release_version = "larp-library-#{ENV.fetch("REVISION")}"
    project_slugs = ENV.fetch("SENTRY_PROJECT_SLUGS", "").split(",")

    uri = URI.parse "https://sentry.io/api/0/organizations/#{ENV.fetch("SENTRY_ORGANIZATION_ID")}/releases/"
    params = { version: release_version, projects: project_slugs }

    request = Net::HTTP::Post.new(uri)
    request.body = JSON.dump(params)
    request["Authorization"] = "Bearer #{ENV.fetch("SENTRY_RELEASE_TOKEN")}"
    request["Content-Type"] = "application/json"

    Net::HTTP.start(uri.host, uri.port, :ENV, use_ssl: true) do |http|
      response = http.request(request)
      unless response.is_a?(Net::HTTPSuccess)
        raise "Sentry error: #{response.code}\n#{response.body}\n\nRequest URI: #{uri}\nRequest body: #{request.body}"
      end
    end

    uri = URI.parse(
      "https://sentry.io/api/0/organizations/#{ENV.fetch("SENTRY_ORGANIZATION_ID")}/releases/#{release_version}/deploys/"
    )
    params = { environment: ENV.fetch("RAILS_ENV"), projects: project_slugs }

    request = Net::HTTP::Post.new(uri)
    request.body = JSON.dump(params)
    request["Authorization"] = "Bearer #{ENV.fetch("SENTRY_RELEASE_TOKEN")}"
    request["Content-Type"] = "application/json"

    Net::HTTP.start(uri.host, uri.port, :ENV, use_ssl: true) do |http|
      response = http.request(request)
      unless response.is_a?(Net::HTTPSuccess)
        raise "Sentry error: #{response.code}\n#{response.body}\n\nRequest URI: #{uri}\nRequest body: #{request.body}"
      end
    end

    puts "Sentry notification complete."
  end

  desc "Perform an app release (database migrations and deploy tracking)"
  task perform: :environment do
    puts "Running database migrations"
    Rake::Task["db:migrate"].invoke

    puts "Running release notification"
    Rake::Task["release:notify"].invoke if ENV["SENTRY_RELEASE_TOKEN"].present?
  end
end

# rubocop:enable Metrics/BlockLength
