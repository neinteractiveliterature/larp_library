# frozen_string_literal: true
class Project < ApplicationRecord # rubocop:disable Metrics/ClassLength
  include PgSearch::Model
  multisearchable against: %i[title_for_search authors description brand_name]

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
      dedication_html:
        "To the extent possible under copyright law, the author has waived all \
copyright and related or neighboring rights to this work."
    },
    mit: {
      name: "MIT License",
      url: "http://opensource.org/licenses/MIT",
      dedication_html:
        "This work is licensed under an <a href=\"http://opensource.org/licenses/MIT\">\
MIT License</a>."
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
  }.freeze

  has_many :project_files, dependent: :destroy
  has_many :project_links, dependent: :destroy
  has_and_belongs_to_many :tags # rubocop:disable Rails/HasAndBelongsToMany
  belongs_to :brand
  delegate :name, to: :brand, prefix: true

  validates :license, inclusion: { in: LICENSES.keys.map(&:to_s), allow_nil: true }
  validates :brand, presence: true
  validate :cannot_have_files_without_license

  pg_search_scope :search,
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      any_word: true,
                      dictionary: "english",
                      tsvector_column: %w[title_vector description_vector authors_vector]
                    }
                  }
  pg_search_scope :search_title,
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      any_word: true,
                      dictionary: "english",
                      tsvector_column: ["title_vector"]
                    }
                  }
  pg_search_scope :search_description,
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      any_word: true,
                      dictionary: "english",
                      tsvector_column: ["description_vector"]
                    }
                  }
  pg_search_scope :search_authors,
                  ignoring: :accents,
                  using: {
                    tsearch: {
                      any_word: true,
                      dictionary: "english",
                      tsvector_column: ["authors_vector"]
                    }
                  }

  def tag_names
    tags.map(&:name).map(&:downcase)
  end

  def tag_names=(new_tag_names)
    new_tag_names = new_tag_names.reject(&:blank?)
    existing_tag_names = tag_names

    removed_tags = tags.where(name: (existing_tag_names - new_tag_names))
    tags.delete(removed_tags)

    (new_tag_names - existing_tag_names).each do |new_tag_name|
      tag = Tag.find_or_create_by(name: new_tag_name)
      tags << tag
    end
  end

  def license_object
    OpenStruct.new(LICENSES[license.to_sym]) if license.present?
  end

  def license_id=(license_id)
    self.license = license_id
  end

  # Remove leading "A", "An", and "The" from titles
  def title_for_search
    title.strip.sub(/\Athe\s+/i, "").sub(/\Aan?\s+/i, "")
  end

  def to_param
    title ? "#{id}-#{title.parameterize}" : id
  end

  private

  def cannot_have_files_without_license
    return if license.present?
    return if project_files.none?

    errors.add :license, "is required because this project has downloadable files"
  end
end
