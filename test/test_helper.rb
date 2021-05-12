ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

DatabaseCleaner.strategy = :truncation

class ActiveSupport::TestCase
  self.use_transactional_tests = false

  include FactoryBot::Syntax::Methods

  setup do
    [Project, Tag].each do |model|
      model.__elasticsearch__.create_index! force: true
      model.__elasticsearch__.refresh_index!
    end

    DatabaseCleaner.clean
  end

  def elasticsearch_source(model)
    model.__elasticsearch__.client.get(
      index: model.__elasticsearch__.index_name,
      type: model.__elasticsearch__.document_type,
      id: model.id
    )['_source']
  end
end

class ActionController::TestCase
  include Devise::Test::ControllerHelpers
end
