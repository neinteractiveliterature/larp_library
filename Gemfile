# frozen_string_literal: true
ruby File.read(File.expand_path(".ruby-version", __dir__)).strip

source "https://rubygems.org"

gem "dotenv-rails", require: "dotenv/load", groups: %i[development test]

gem "pg"
gem "rails", "7.2.2.1"

gem "minipack"
gem "sprockets-rails"

gem "listen"

gem "cancancan"
gem "devise", "~> 4.9.0"
gem "intercode_client"
gem "omniauth-rails_csrf_protection"
gem "rack-cas"

# Logging
gem "cloudwatchlogger", github: "zshannon/cloudwatchlogger", branch: "master"
gem "lograge"

gem "net-imap"
gem "net-pop"
gem "net-smtp"

gem "aws-sdk-s3"
gem "aws-sigv4"

gem "graphql"

gem "color"
gem "redcarpet"
gem "truncate_html"

gem "pg_search"

gem "rollbar"

gem "aws-sdk-rails"

gem "acts_as_list"

group :development do
  gem "graphiql-rails"
  gem "prettier", "~> 4.0"
  gem "prettier_print"
  gem "rubocop"
  gem "rubocop-performance"
  gem "rubocop-rails"
  gem "solargraph"
end

group :development, :test do
  gem "byebug"
  gem "database_cleaner"
  gem "factory_bot_rails"
  gem "graphql-rails_logger"
  gem "pry-rails"
  gem "spring"
end

group :production do
  gem "puma"
end
