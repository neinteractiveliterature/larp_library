module Mutations
  class UpdateProject < BaseMutation
    argument :id, ID, required: true
    argument :project_attributes, Types::ProjectAttributes, required: true

    field :project, Types::ProjectType, null: false

    def authorized?(id:, project_attributes:)
      @project = Project.find(id)
      context[:current_ability].authorize! :update, @project
      true
    end

    def resolve(id:, project_attributes:)
      @project.update!(project_attributes.to_h)
      { project: @project }
    end
  end
end
