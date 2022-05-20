# frozen_string_literal: true
module Mutations
  class UpdateTagCategory < BaseMutation
    argument :id, ID, required: true
    argument :tag_category_attributes, Types::TagCategoryAttributes, required: true

    field :tag_category, Types::TagCategoryType, null: false

    def authorized?(id:, **_args)
      @tag_category = TagCategory.find(id)
      context[:current_ability].authorize! :update, @tag_category
      true
    end

    def resolve(tag_category_attributes:, **_args)
      @tag_category.update!(tag_category_attributes.to_h)
      { tag_category: @tag_category }
    end
  end
end
