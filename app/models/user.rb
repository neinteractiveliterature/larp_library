class User < ApplicationRecord
  devise :cas_authenticatable, :trackable

  has_many :brand_memberships
  has_many :brands, through: :brand_memberships

  def name
    "#{firstname} #{lastname}"
  end

  def cas_extra_attributes=(extra_attributes)
    extra_attributes.each do |name, value|
      case name.to_sym
      when :firstname
        self.firstname = value
      when :lastname
        self.lastname = value
      when :email
        self.email = value
      end
    end
  end
end
