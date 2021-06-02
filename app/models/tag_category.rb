class TagCategory < ApplicationRecord
  has_many :tags
  validates :name, { presence: true, uniqueness: true }
  validates :color, { format: { with: /\A\#[0-9a-z]{6}\z/ } }

  def color
    self[:color] || '#777777'
  end

  def text_color
    if Color::RGB.by_hex(color).brightness > 0.5
      '#000000'
    else
      '#ffffff'
    end
  end

  def icon
    self[:icon] || 'tag'
  end
end
