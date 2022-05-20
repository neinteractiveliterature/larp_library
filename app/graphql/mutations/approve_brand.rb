# frozen_string_literal: true
module Mutations
  class ApproveBrand < BaseMutation
    argument :id, ID, required: true

    field :brand, Types::BrandType, null: false

    def authorized?(id:)
      @brand = Brand.find(id)
      context[:current_ability].authorize! :approve, @brand
      true
    end

    def resolve(**_args)
      @brand.update!(approved: true)
      BrandMailer.brand_approved(@brand).deliver_later
      { brand: @brand }
    end
  end
end
