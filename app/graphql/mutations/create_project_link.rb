# frozen_string_literal: true
module Mutations
  class CreateProjectLink < BaseMutation
    argument :project_id, ID, required: true
    argument :project_link_attributes, Types::ProjectLinkAttributes, required: true

    field :project_link, Types::ProjectLinkType, null: false

    def authorized?(project_id:, project_link_attributes:)
      @project = Project.find(project_id)
      @project_link = @project.project_links.new(project_link_attributes.to_h)
      context[:current_ability].authorize! :create, @project_link
      true
    end

    def resolve(**_args)
      @project_link.save!
      { project_link: @project_link }
    end
  end
end
