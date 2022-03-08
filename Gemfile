ruby File.read(File.expand_path('.ruby-version', __dir__)).strip

source 'https://rubygems.org'

gem 'dotenv-rails', groups: [:development, :test]

gem 'rails', '= 6.1.4.7'
gem 'pg'

gem 'minipack'

gem 'listen'

gem 'devise', '~> 4.8.0'
gem 'devise_cas_authenticatable', '~> 2.0.0.alpha1'
gem 'rack-cas'
gem 'cancancan'

gem 'net-pop'
gem 'net-smtp'
gem 'net-imap'

gem 'aws-sdk-s3'

gem 'graphql'

gem 'redcarpet'
gem 'truncate_html'
gem 'color'

# Very important: do not upgrade Elasticsearch gem, it will break on Bonsai because Elasticsearch
# are being assholes about open source
gem 'elasticsearch', '7.13.3'
gem 'elasticsearch-rails', '~> 7.2.0'
gem 'elasticsearch-model', '~> 7.2.0'

gem 'rollbar'

gem 'aws-sdk-rails'

gem 'acts_as_list'

group :development do
  gem 'graphiql-rails'
  gem 'rubocop'
  gem 'rubocop-rails'
  gem 'rubocop-performance'
  gem 'solargraph'
end

group :development, :test do
  gem 'byebug'
  gem 'spring'
  gem 'pry-rails'
  gem 'factory_bot_rails'
  gem 'database_cleaner'
  gem 'graphql-rails_logger'
end

group :production do
  gem 'puma'
end
