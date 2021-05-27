module Mutations
  class DeleteTagCategory < BaseMutation
    argument :id, ID, required: true

    field :tag_category, Types::TagCategoryType, null: false

    def authorized?(id:)
      @tag_category = TagCategory.find(id)
      context[:current_ability].authorize! :delete, @tag_category
      true
    end

    def resolve(**_args)
      @tag_category.destroy!
      { tag_category: @tag_category }
    end
  end
end
