class Project < ActiveRecord::Base
  include ElasticsearchModel

  LICENSES = {
    cc40_by: {
      name: "Creative Commons Attribution 4.0 International",
      url: "http://creativecommons.org/licenses/by/4.0/",
      logo_url: "https://i.creativecommons.org/l/by/4.0/88x31.png"
    },
    cc40_by_sa: {
      name: "Creative Commons Attribution-ShareAlike 4.0 International",
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
    },
    cc40_by_nc: {
      name: "Creative Commons Attribution-NonCommercial 4.0 International",
      url: "http://creativecommons.org/licenses/by-nc/4.0/",
      logo_url: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png",
      discouraged: true
    },
    cc40_by_nc_sa: {
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
      url: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
      logo_url: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
      discouraged: true
    },
    cc20_by: {
      name: "Creative Commons Attribution 2.0 Generic",
      url: "http://creativecommons.org/licenses/by/2.0/",
      logo_url: "https://i.creativecommons.org/l/by/2.0/88x31.png",
      discouraged: true,
      discouraged_reason: "obsolete, please use 4.0 if possible"
    },
    cc20_by_sa: {
      name: "Creative Commons Attribution-ShareAlike 2.0 Generic",
      url: "http://creativecommons.org/licenses/by-sa/2.0/",
      logo_url: "https://i.creativecommons.org/l/by-sa/2.0/88x31.png",
      discouraged: true,
      discouraged_reason: "obsolete, please use 4.0 if possible"
    },
    cc20_by_nc: {
      name: "Creative Commons Attribution-NonCommercial 2.0 Generic",
      url: "http://creativecommons.org/licenses/by-nc/2.0/",
      logo_url: "https://i.creativecommons.org/l/by-nc/2.0/88x31.png",
      discouraged: true,
      discouraged_reason: "obsolete and also discouraged, see our licensing page for details"
    },
    cc20_by_nc_sa: {
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic",
      url: "http://creativecommons.org/licenses/by-nc-sa/2.0/",
      logo_url: "https://i.creativecommons.org/l/by-nc-sa/2.0/88x31.png",
      discouraged: true,
      discouraged_reason: "obsolete and also discouraged, see our licensing page for details"
    }
  }

  mapping do
    indexes :title, :type => 'text', fields: { raw: { type: 'keyword' } }
    indexes :authors, :type => 'text'
    indexes :license, :type => 'keyword'
    indexes :description, :type => 'text'
    indexes :tag_names, :type => 'keyword'
    indexes :brand_name, :type => 'text'
    indexes :brand_id, :type => 'integer'
  end

  has_many :project_files, dependent: :destroy
  has_and_belongs_to_many :tags
  belongs_to :brand

  validates :license, inclusion: { in: LICENSES.keys.map(&:to_s) }
  validates :brand, presence: true

  self.per_page = 10

  def tag_names
    tags.map(&:name).map(&:downcase)
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

  # Remove leading "A", "An", and "The" from titles
  def title_for_search
    title.strip.sub(/\Athe\s+/i, '').sub(/\Aan?\s+/i, '')
  end

  def as_indexed_json(options={})
    {
      title: title_for_search,
      authors: authors,
      license: license,
      description: description,
      tag_names: tag_names,
      brand_name: brand.try(:name),
      brand_id: brand.try(:id)
    }.as_json
  end

  def to_param
    if title
      "#{id}-#{title.parameterize}"
    else
      id
    end
  end
end
