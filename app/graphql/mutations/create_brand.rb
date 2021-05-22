module Mutations
  class CreateBrand < BaseMutation
    argument :brand_attributes, Types::BrandAttributes, required: true

    field :brand, Types::BrandType, null: false

    def authorized?(brand_attributes:)
      @brand = Brand.new(brand_attributes.to_h.merge(creator: context[:current_user]))
      context[:current_ability].authorize! :create, @brand
      true
    end

    def resolve(**_args)
      @brand.save!
      @brand.brand_memberships.create!(user: context[:current_user], admin: true)
      BrandMailer.brand_pending(@brand).deliver_later

      { brand: @brand }
    end
  end
end
