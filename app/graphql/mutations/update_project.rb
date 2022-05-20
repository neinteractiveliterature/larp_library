# frozen_string_literal: true
module Mutations
  class UpdateProject < BaseMutation
    argument :id, ID, required: true
    argument :project_attributes, Types::ProjectAttributes, required: true

    field :project, Types::ProjectType, null: false

    def authorized?(id:, **_args)
      @project = Project.find(id)
      context[:current_ability].authorize! :update, @project
      true
    end

    def resolve(project_attributes:, **_args)
      @project.update!(project_attributes.to_h)
      { project: @project }
    end
  end
end
