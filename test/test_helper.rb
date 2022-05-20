# frozen_string_literal: true
ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../config/environment", __dir__)
require "rails/test_help"

DatabaseCleaner.strategy = :truncation

class ActiveSupport::TestCase
  self.use_transactional_tests = false

  include FactoryBot::Syntax::Methods

  setup do
    DatabaseCleaner.clean
  end
end

class ActionController::TestCase
  include Devise::Test::ControllerHelpers
end
