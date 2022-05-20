# frozen_string_literal: true
module Mutations
  class UpdateTag < BaseMutation
    argument :id, ID, required: true
    argument :tag_attributes, Types::TagAttributes, required: true

    field :tag, Types::TagType, null: false

    def authorized?(id:, **_args)
      @tag = Tag.find(id)
      context[:current_ability].authorize! :update, @tag
      true
    end

    def resolve(tag_attributes:, **_args)
      @tag.update!(tag_attributes.to_h)
      { tag: @tag }
    end
  end
end
