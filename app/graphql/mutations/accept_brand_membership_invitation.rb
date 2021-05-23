module Mutations
  class AcceptBrandMembershipInvitation < BaseMutation
    argument :brand_id, ID, required: true
    argument :invitation_token, String, required: true

    field :brand_membership, Types::BrandMembershipType, null: false

    def authorized?(**_args)
      !!context[:current_user]
    end

    def resolve(brand_id:, invitation_token:)
      @brand_membership = BrandMembership.find_by!(
        brand_id: brand_id,
        invitation_token: invitation_token
      )
      @brand_membership.update!(user: context[:current_user], invitation_token: nil)

      { brand_membership: @brand_membership }
    end
  end
end
