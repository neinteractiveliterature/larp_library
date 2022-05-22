# frozen_string_literal: true
class User < ApplicationRecord
  devise :omniauthable, :trackable, omniauth_providers: %i[intercode]

  has_many :brand_memberships, dependent: :destroy
  has_many :brands, through: :brand_memberships

  def name
    "#{firstname} #{lastname}"
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create! do |user|
      user.email = auth.info.email
      user.firstname = auth.info.first_name
      user.lastname = auth.info.last_name
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      data = session["devise.intercode_data"]
      user.email = data["email"] if data && data["extra"]["raw_info"] && user.email.blank?
    end
  end
end
