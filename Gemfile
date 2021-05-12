ruby '2.5.7'

source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '= 6.0.3.7'
# Use sqlite3 as the database for Active Record
gem 'sqlite3', groups: [:development, :test]
gem 'pg', group: :production
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 5.0.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

gem 'webpacker', '~> 6.x'

gem 'bootstrap-sass', '~> 3.4.1'
gem 'listen'
gem 'font-awesome-rails'

# Use jquery as the JavaScript library
gem 'jquery-rails', '= 4.4.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'devise', '~> 4.8.0'
gem 'devise_cas_authenticatable'
gem 'cancancan'

gem 'rails-assets-evaporatejs', '1.6.3', source: 'https://rails-assets.org'
gem 'rails-assets-bootstrap-colorpicker', '2.3.3', source: 'https://rails-assets.org'
gem 'rails-assets-bootstrap', '~> 3.3.7', source: 'https://rails-assets.org'
gem 'fog'
gem 'xmlrpc'

gem 'haml'
gem 'redcarpet'
gem 'truncate_html'
gem 'will_paginate'
gem 'will_paginate-bootstrap'
gem 'color'

gem 'ace-rails-ap'
gem "selectize-rails"

gem 'elasticsearch-rails', '6.0.0'
gem 'elasticsearch-model', '6.0.0'

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
