module Concerns::Elasticsearch
  extend ActiveSupport::Concern
  
  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name "larp_library_#{Rails.env}"
  end
end