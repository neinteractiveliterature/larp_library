class Tag < ActiveRecord::Base
  include ElasticsearchModel

  has_and_belongs_to_many :projects
  belongs_to :tag_category, optional: true

  validates :name, presence: true
  delegate :name, to: :tag_category, prefix: 'category', allow_nil: true

  mapping do
    indexes :name, type: 'text'
    indexes :category_name, type: 'text'
  end

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
