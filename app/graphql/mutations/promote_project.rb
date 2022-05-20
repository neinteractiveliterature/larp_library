# frozen_string_literal: true
module Mutations
  class PromoteProject < BaseMutation
    argument :project_id, ID, required: true

    field :project_promotion, Types::ProjectPromotionType, null: false

    def authorized?(project_id:)
      @project = Project.find(project_id)
      @project_promotion = ProjectPromotion.new(project: @project)
      context[:current_ability].authorize! :create, @project_promotion
      true
    end

    def resolve(**_args)
      @project_promotion.save!
      { project_promotion: @project_promotion }
    end
  end
end
