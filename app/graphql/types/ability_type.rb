# frozen_string_literal: true
module Types
  class AbilityType < Types::BaseObject
    field :can_approve_brands, Boolean, null: false
    field :can_create_project_promotions, Boolean, null: false
    field :can_update_tags, Boolean, null: false
    field :can_update_tag_categories, Boolean, null: false

    def can_approve_brands
      object.can? :approve, Brand
    end

    def can_create_project_promotions
      object.can? :create, ProjectPromotion
    end

    def can_update_tags
      object.can? :update, Tag
    end

    def can_update_tag_categories
      object.can? :update, TagCategory
    end
  end
end
