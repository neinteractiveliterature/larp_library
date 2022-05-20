# frozen_string_literal: true
class TagCategory < ApplicationRecord
  has_many :tags, dependent: :nullify
  validates :name, { presence: true, uniqueness: true }
  validates :color, { format: { with: /\A\#[0-9a-z]{6}\z/ } }

  def color
    self[:color] || "#777777"
  end

  def text_color
    Color::RGB.by_hex(color).brightness > 0.5 ? "#000000" : "#ffffff"
  end

  def icon
    self[:icon] || "tag"
  end
end
