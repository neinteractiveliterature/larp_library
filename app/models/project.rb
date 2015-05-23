class Project < ActiveRecord::Base
  include Concerns::Elasticsearch
  
  mapping do
    indexes :title, :type => 'string'
    indexes :authors, :type => 'string'
    indexes :license, :index => :not_analyzed
    indexes :description, :type => 'string'
    indexes :tag_names, :type => 'string'
  end
  
  has_many :project_files
  has_and_belongs_to_many :tags
  
  def tag_names
    tags.map(&:name)
  end
  
  def tag_names=(new_tag_names)
    new_tag_names = new_tag_names.reject(&:blank?)
    existing_tag_names = tag_names
    
    removed_tags = tags.where(name: (existing_tag_names - new_tag_names))
    self.tags.delete(removed_tags)
    
    (new_tag_names - existing_tag_names).each do |new_tag_name|
      tag = Tag.find_or_create_by(name: new_tag_name)
      self.tags << tag
    end
  end
  
  def as_indexed_json(options={})
    {
      title: title,
      authors: authors,
      license: license,
      description: description,
      tag_names: tag_names
    }.as_json
  end
end
