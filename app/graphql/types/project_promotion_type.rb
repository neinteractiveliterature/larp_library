module Types
  class ProjectPromotionType < Types::BaseObject
    field :id, ID, null: false
    field :project, Types::ProjectType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    association_loader ProjectPromotion, :project
  end
end
