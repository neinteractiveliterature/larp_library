# frozen_string_literal: true
module Mutations
  class DeleteBrandMembership < BaseMutation
    argument :id, ID, required: true

    field :brand_membership, Types::BrandMembershipType, null: false

    def authorized?(id:)
      @brand_membership = BrandMembership.find(id)
      context[:current_ability].authorize! :delete, @brand_membership
      true
    end

    def resolve(**_args)
      @brand_membership.destroy!
      { brand_membership: @brand_membership }
    end
  end
end
