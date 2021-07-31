module Mutations
  class UpdateProjectLink < BaseMutation
    argument :id, ID, required: true
    argument :project_link_attributes, Types::ProjectLinkAttributes, required: true

    field :project_link, Types::ProjectLinkType, null: false

    def authorized?(id:, **_args)
      @project_link = ProjectLink.find(id)
      context[:current_ability].authorize! :update, @project_link
      true
    end

    def resolve(project_link_attributes:, **_args)
      @project_link.update!(project_link_attributes.to_h)
      { project_link: @project_link }
    end
  end
end
