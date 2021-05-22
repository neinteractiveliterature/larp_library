module ElasticsearchModel
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name "#{model_name.collection.tr('/', '-')}-test" if Rails.env.test?

    after_commit(on: [:create, :update]) { __elasticsearch__.index_document }
    after_commit(on: [:destroy]) { __elasticsearch__.delete_document }
  end
end
