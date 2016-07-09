class Tag < ActiveRecord::Base
  include Concerns::Elasticsearch

  has_and_belongs_to_many :projects
  has_and_belongs_to_many :tag_categories

  mapping do
    indexes :name, :type => 'string'
    indexes :category_names, :type => 'string'
  end

  def category_names
    tag_categories.map(&:name)
  end
end
