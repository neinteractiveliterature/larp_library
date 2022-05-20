# frozen_string_literal: true
class Tag < ApplicationRecord
  include PgSearch::Model
  multisearchable against: %i[name category_name]

  has_and_belongs_to_many :projects # rubocop:disable Rails/HasAndBelongsToMany
  belongs_to :tag_category, optional: true

  validates :name, presence: true
  delegate :name, to: :tag_category, prefix: "category", allow_nil: true

  def color
    tag_category.try(:color) || TagCategory.new.color
  end

  def text_color
    tag_category.try(:text_color) || TagCategory.new.text_color
  end

  def icon
    tag_category.try(:icon) || TagCategory.new.icon
  end

  def as_indexed_json(_options = {})
    as_json(methods: [:category_name])
  end
end
