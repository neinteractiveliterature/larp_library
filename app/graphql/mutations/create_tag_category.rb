module Mutations
  class CreateTagCategory < BaseMutation
    argument :tag_category_attributes, Types::TagCategoryAttributes, required: true

    field :tag_category, Types::TagCategoryType, null: false

    def authorized?(tag_category_attributes:)
      @tag_category = TagCategory.new(tag_category_attributes.to_h)
      context[:current_ability].authorize! :create, @tag_category
      true
    end

    def resolve(**_args)
      @tag_category.save!
      { tag_category: @tag_category }
    end
  end
end
