class Brand < ApplicationRecord
  has_many :brand_memberships, dependent: :destroy
  has_many :users, through: :brand_memberships
  has_many :projects
  belongs_to :creator, class_name: 'User'

  validates :slug, exclusion: { in: %w[new unapproved approve] }
  validates :name, uniqueness: { message: 'has already been taken.' }
  validates :slug, uniqueness: {
    message: 'has already been taken.  Please choose a different name.'
  }

  def name=(name)
    self[:name] = name
    self[:slug] = name.parameterize if slug.blank?
  end

  def to_param
    slug
  end
end
