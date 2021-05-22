module Mutations
  class DeleteProject < BaseMutation
    argument :id, ID, required: true

    field :project, Types::ProjectType, null: false

    def authorized?(id:)
      @project = Project.find(id)
      context[:current_ability].authorize! :delete, @project
      true
    end

    def resolve(**_args)
      @project.destroy!
      { project: @project }
    end
  end
end
