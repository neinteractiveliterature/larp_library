# frozen_string_literal: true
class BrandMembership < ApplicationRecord
  belongs_to :brand
  belongs_to :user, optional: true

  delegate :email, to: :user, allow_nil: true
  after_save :send_invitation_email_if_necessary

  validates :user_id,
            uniqueness: {
              scope: :brand_id,
              unless: :invitation_token,
              message: I18n.t("brand_membership.already_member_error")
            }

  def email=(email)
    self.invitation_email = email
    self.invitation_token ||= Devise.friendly_token
    @send_invitation_email = true
  end

  def inviting_user_id=(inviting_user_id)
    return if inviting_user_id.blank?
    @inviting_user = User.find(inviting_user_id)
  end

  def to_param
    invitation_token
  end

  private

  def send_invitation_email_if_necessary
    return unless @send_invitation_email
    BrandMembershipsMailer.invitation(self, @inviting_user).deliver_later
  end
end
