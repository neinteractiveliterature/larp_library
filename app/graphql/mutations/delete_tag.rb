# frozen_string_literal: true
module Mutations
  class DeleteTag < BaseMutation
    argument :id, ID, required: true

    field :tag, Types::TagType, null: false

    def authorized?(id:)
      @tag = Tag.find(id)
      context[:current_ability].authorize! :delete, @tag
      true
    end

    def resolve(**_args)
      @tag.destroy!
      { tag: @tag }
    end
  end
end
