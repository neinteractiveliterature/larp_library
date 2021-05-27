module Mutations
  class CreateTag < BaseMutation
    argument :tag_attributes, Types::TagAttributes, required: true

    field :tag, Types::TagType, null: false

    def authorized?(tag_attributes:)
      @tag = Tag.new(tag_attributes.to_h)
      context[:current_ability].authorize! :create, @tag
      true
    end

    def resolve(**_args)
      @tag.save!
      { tag: @tag }
    end
  end
end
