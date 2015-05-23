class Tag < ActiveRecord::Base
  include Concerns::Elasticsearch
  
  has_and_belongs_to_many :projects
  
  mapping do
    indexes :name, :type => 'string'
  end
end
