# frozen_string_literal: true
module Mutations
  class DeleteProjectLink < BaseMutation
    argument :id, ID, required: true

    field :project_link, Types::ProjectLinkType, null: false

    def authorized?(id:)
      @project_link = ProjectLink.find(id)
      context[:current_ability].authorize! :delete, @project_link
      true
    end

    def resolve(**_args)
      @project_link.destroy!
      { project_link: @project_link }
    end
  end
end
