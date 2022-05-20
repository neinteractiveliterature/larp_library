# frozen_string_literal: true
module Mutations
  class MoveProjectFile < BaseMutation
    argument :id, ID, required: true
    argument :destination_index, Int, required: true

    field :project_file, Types::ProjectFileType, null: false
    field :project, Types::ProjectType, null: false

    def authorized?(id:, **_args)
      @project_file = ProjectFile.find(id)
      context[:current_ability].authorize! :update, @project_file
      true
    end

    def resolve(destination_index:, **_args)
      # https://github.com/brendon/acts_as_list#2-rescue-then-retry
      attempts_left = 2
      while attempts_left.positive?
        attempts_left -= 1
        begin
          ProjectFile.transaction do
            @project_file.insert_at(destination_index + 1)
          end
          attempts_left = 0
        rescue ActiveRecord::Deadlocked
          raise unless attempts_left.positive?
        end
      end

      { project_file: @project_file, project: @project_file.project }
    end
  end
end
