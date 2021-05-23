ruby '2.7.3'

source 'https://rubygems.org'

gem 'dotenv-rails', groups: [:development, :test]

gem 'rails', '= 6.1.3.2'
gem 'pg'

gem 'minipack'

gem 'listen'

gem 'devise', '~> 4.8.0'
gem 'devise_cas_authenticatable'
gem 'cancancan'

gem 'aws-sdk-s3'

gem 'graphql'

gem 'haml'
gem 'redcarpet'
gem 'truncate_html'
gem 'color'

gem 'elasticsearch-rails', '~> 6.1.1'
gem 'elasticsearch-model', '~> 6.1.1'

gem 'figaro'

gem 'rollbar'

gem 'aws-sdk-rails'

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
