class BrandMembershipsMailer < ApplicationMailer
  def invitation(brand_membership, inviting_user)
    @brand_membership = brand_membership
    @inviting_user = inviting_user

    subject = "#{@inviting_user.name} invited you to join #{@brand_membership.brand.name} \
on Larp Library"
    mail(to: @brand_membership.invitation_email, subject: subject)
  end
end
