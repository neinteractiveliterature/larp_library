# frozen_string_literal: true
module Mutations
  class DeleteProjectFile < BaseMutation
    argument :id, ID, required: true

    field :project_file, Types::ProjectFileType, null: false

    def authorized?(id:)
      @project_file = ProjectFile.find(id)
      context[:current_ability].authorize! :delete, @project_file
      true
    end

    def resolve(**_args)
      @project_file.destroy!
      { project_file: @project_file }
    end
  end
end
