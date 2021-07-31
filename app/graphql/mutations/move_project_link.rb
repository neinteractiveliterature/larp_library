module Mutations
  class MoveProjectLink < BaseMutation
    argument :id, ID, required: true
    argument :destination_index, Int, required: true

    field :project_link, Types::ProjectLinkType, null: false
    field :project, Types::ProjectType, null: false

    def authorized?(id:, **_args)
      @project_link = ProjectLink.find(id)
      context[:current_ability].authorize! :update, @project_link
      true
    end

    def resolve(destination_index:, **_args)
      # https://github.com/brendon/acts_as_list#2-rescue-then-retry
      attempts_left = 2
      while attempts_left > 0
        attempts_left -= 1
        begin
          ProjectLink.transaction do
            @project_link.insert_at(destination_index + 1)
          end
          attempts_left = 0
        rescue ActiveRecord::Deadlocked
          raise unless attempts_left > 0
        end
      end

      { project_link: @project_link, project: @project_link.project }
    end
  end
end
