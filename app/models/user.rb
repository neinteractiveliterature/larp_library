class User < ActiveRecord::Base
  devise :trackable, :omniauthable, omniauth_providers: %i[intercode]

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

  def self.from_omniauth(auth)

    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.firstname = auth.info.first_name
      user.lastname = auth.info.last_name
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session['devise.intercode_data'] && session['devise.intercode_data']['extra']['raw_info']
        user.email = data['email'] if user.email.blank?
      end
    end
  end
end
