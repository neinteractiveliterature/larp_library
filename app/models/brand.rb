class Brand < ActiveRecord::Base
  has_many :brand_memberships, dependent: :destroy
  has_many :users, through: :brand_memberships
  has_many :projects
  belongs_to :creator, class_name: "User"
  
  accepts_nested_attributes_for :brand_memberships, allow_destroy: true,
    reject_if: proc { |attributes| attributes['id'].blank? && attributes['email'].blank? }
  
  validates_exclusion_of :slug, in: %w(new unapproved approve)
  validates_uniqueness_of :name, message: "has already been taken."
  validates_uniqueness_of :slug, message: "has already been taken.  Please choose a different name."
  
  def name=(name)
    write_attribute :name, name
    
    if slug.blank?
      self.slug = name.parameterize
    end
  end
  
  def to_param
    slug
  end
end
