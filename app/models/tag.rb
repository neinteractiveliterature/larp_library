class Tag < ActiveRecord::Base
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks
  
  has_and_belongs_to_many :projects
  
  mapping do
    indexes :name, :type => 'string'
  end
end
