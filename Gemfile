ruby '2.5.0'

source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '5.1.6'
# Use sqlite3 as the database for Active Record
gem 'sqlite3', groups: [:development, :test]
gem 'pg', group: :production
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

gem 'bootstrap-sass', '~> 3.3.7'
gem 'font-awesome-rails'

# Use jquery as the JavaScript library
gem 'jquery-rails', '= 4.3.1'  # pegging this at 2.1.4 to hopefully work around s3_direct_upload compat
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'devise', '~> 4.4.1'
gem 'devise_cas_authenticatable'
gem 'cancancan'

gem 'rails_12factor'

gem 'rails-assets-evaporatejs', '1.6.3', source: 'https://rails-assets.org'
gem 'rails-assets-bootstrap-colorpicker', source: 'https://rails-assets.org'
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

gem 'elasticsearch-rails'
gem 'elasticsearch-model'

gem 'high_voltage'

gem 'figaro'

gem 'capistrano', '3.3.5', group: :development
gem 'capistrano-rails'
gem 'capistrano-rbenv'
gem 'capistrano-passenger'

gem 'rollbar'
# gem 'rails_12factor', group: :production

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  gem 'pry-rails'
end

group :production do
  gem 'puma'
end
