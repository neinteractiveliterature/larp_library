ruby File.read(File.expand_path(".ruby-version", __dir__)).strip

source "https://rubygems.org"

gem "dotenv-rails", groups: %i[development test]

gem "rails", "7.1.2"
gem "pg"

gem "minipack"
gem "sprockets-rails"

gem "listen"

gem "devise", "~> 4.9.0"
gem "rack-cas"
gem "cancancan"
gem "intercode_client"
gem "omniauth-rails_csrf_protection"

# Logging
gem "cloudwatchlogger", github: "zshannon/cloudwatchlogger", branch: "master"
gem "lograge"

gem "net-pop"
gem "net-smtp"
gem "net-imap"

gem "aws-sdk-s3"
gem "aws-sigv4"

gem "graphql"

gem "redcarpet"
gem "truncate_html"
gem "color"

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
  gem "spring"
  gem "pry-rails"
  gem "factory_bot_rails"
  gem "database_cleaner"
  gem "graphql-rails_logger"
end

group :production do
  gem "puma"
end
