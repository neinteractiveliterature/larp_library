module Concerns::Elasticsearch
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    if Rails.env.test?
      index_name "#{self.model_name.collection.gsub(/\//, '-')}-test"
    end
  end
end
