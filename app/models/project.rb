class Project < ActiveRecord::Base
  has_many :project_files
  has_and_belongs_to_many :tags
  
  def tag_names
    tags.map(&:name)
  end
  
  def tag_names=(new_tag_names)
    new_tag_names = new_tag_names.reject(&:blank?)
    existing_tag_names = tag_names
    tags.where(name: (existing_tag_names - new_tag_names)).destroy_all
    (new_tag_names - existing_tag_names).each do |new_tag_name|
      tag = Tag.find_or_create_by(name: new_tag_name)
      self.tags << tag
    end
  end
end
