module ElasticsearchModel
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    if Rails.env.test?
      index_name "#{self.model_name.collection.gsub(/\//, '-')}-test"
    end

    after_commit(on: [:create, :update]) { __elasticsearch__.index_document }
    after_commit(on: [:destroy]) { __elasticsearch__.delete_document }
  end
end
