module Mutations
  class CreateProject < BaseMutation
    argument :brand_id, ID, required: true
    argument :project_attributes, Types::ProjectAttributes, required: true

    field :project, Types::ProjectType, null: false

    def authorized?(brand_id:, project_attributes:)
      @brand = Brand.find(brand_id)
      @project = @brand.projects.new(project_attributes.to_h)
      context[:current_ability].authorize! :create, @project
      true
    end

    def resolve(**_args)
      @project.save!
      { project: @project }
    end
  end
end
