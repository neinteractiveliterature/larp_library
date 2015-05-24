class Project < ActiveRecord::Base
  include Concerns::Elasticsearch
  
  LICENSES = {
    cc40_by: {
      name: "Creative Commons Attribution 4.0 International",
      url: "http://creativecommons.org/licenses/by/4.0/",
      logo_url: "https://i.creativecommons.org/l/by/4.0/88x31.png"
    },
    cc40_by_sa: {
      name: "Creative Commons Attribution ShareAlike 4.0 International",
      url: "http://creativecommons.org/licenses/by-sa/4.0/",
      logo_url: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
    },
    cc0: {
      name: "Creative Commons CC0 1.0 Universal",
      url: "https://creativecommons.org/publicdomain/zero/1.0/",
      logo_url: "https://licensebuttons.net/l/zero/1.0/88x31.png",
      dedication_html: "To the extent possible under copyright law, the author has waived all copyright and related or neighboring rights to this work."
    },
    mit: {
      name: "MIT License",
      url: "http://opensource.org/licenses/MIT",
      dedication_html: "This work is licensed under an <a href=\"http://opensource.org/licenses/MIT\">MIT License</a>."
    },
    public_domain: {
      name: "Public Domain",
      url: "https://creativecommons.org/publicdomain/mark/1.0/",
      logo_url: "https://licensebuttons.net/l/publicdomain/88x31.png",
      dedication_html: "This work is free of known copyright restrictions."
    }
  }
  
  mapping do
    indexes :title, :type => 'string'
    indexes :authors, :type => 'string'
    indexes :license, :index => :not_analyzed
    indexes :description, :type => 'string'
    indexes :tag_names, :type => 'string'
  end
  
  has_many :project_files, dependent: :destroy
  has_and_belongs_to_many :tags
  
  validates :license, inclusion: { in: LICENSES.keys.map(&:to_s) }
  
  self.per_page = 10
  
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
  
  def license_object
    OpenStruct.new(LICENSES[license.to_sym]) if license.present?
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
