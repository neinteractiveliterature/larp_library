# frozen_string_literal: true
module Mutations
  class UpdateBrand < BaseMutation
    argument :id, ID, required: true
    argument :brand_attributes, Types::BrandAttributes, required: true

    field :brand, Types::BrandType, null: false

    def authorized?(id:, **_args)
      @brand = Brand.find(id)
      context[:current_ability].authorize! :update, @brand
      true
    end

    def resolve(brand_attributes:, **_args)
      @brand.update!(brand_attributes.to_h)
      { brand: @brand }
    end
  end
end
