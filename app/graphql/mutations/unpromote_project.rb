# frozen_string_literal: true
module Mutations
  class UnpromoteProject < BaseMutation
    argument :project_id, ID, required: true

    field :project_promotion, Types::ProjectPromotionType, null: false

    def authorized?(project_id:)
      @project_promotion = ProjectPromotion.find_by!(project_id: project_id)
      context[:current_ability].authorize! :destroy, @project_promotion
      true
    end

    def resolve(**_args)
      @project_promotion.destroy!
      { project_promotion: @project_promotion }
    end
  end
end
