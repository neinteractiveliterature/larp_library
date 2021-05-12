ruby '2.7.3'

source 'https://rubygems.org'

gem 'dotenv-rails', groups: [:development, :test]

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '= 6.0.3.7'
# Use sqlite3 as the database for Active Record
gem 'sqlite3', groups: [:development, :test]
gem 'pg', group: :production

gem 'minipack'

gem 'listen'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'devise', '~> 4.8.0'
gem 'devise_cas_authenticatable'
gem 'cancancan'

gem 'fog'
gem 'xmlrpc'

gem 'haml'
gem 'redcarpet'
gem 'truncate_html'
gem 'will_paginate'
gem 'will_paginate-bootstrap'
gem 'color'

gem 'elasticsearch-rails', '~> 6.1.1'
gem 'elasticsearch-model', '~> 6.1.1'

gem 'high_voltage'

gem 'figaro'

gem 'rollbar'

gem 'aws-sdk-rails'

# gem 'rails_12factor', group: :production

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  gem 'pry-rails'

  gem 'factory_bot_rails'
  gem 'database_cleaner'
end

group :production do
  gem 'puma'
end
