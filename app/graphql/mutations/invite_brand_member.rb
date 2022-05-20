# frozen_string_literal: true
module Mutations
  class InviteBrandMember < BaseMutation
    argument :brand_id, ID, required: true
    argument :email, String, required: true
    argument :admin, Boolean, required: true

    field :brand_membership, Types::BrandMembershipType, null: false

    def authorized?(brand_id:, email:, admin:)
      @brand = Brand.find(brand_id)
      @brand_membership = @brand.brand_memberships.new(email: email, admin: admin)
      context[:current_ability].authorize! :create, @brand_membership
      true
    end

    def resolve(**_args)
      @brand_membership.save!
      BrandMembershipsMailer.invitation(@brand_membership, context[:current_user]).deliver_later

      { brand_membership: @brand_membership }
    end
  end
end
