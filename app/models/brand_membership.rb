class BrandMembership < ApplicationRecord
  belongs_to :brand
  belongs_to :user, optional: true

  delegate :email, to: :user, allow_nil: true
  after_save :send_invitation_email_if_necessary

  validates :user_id, uniqueness: {
    unless: :invitation_token,
    message: 'is already a member of this brand'
  }

  def email=(email)
    self.invitation_email = email
    self.invitation_token ||= Devise.friendly_token
    @send_invitation_email = true
  end

  def inviting_user_id=(inviting_user_id)
    return unless inviting_user_id.present?
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
