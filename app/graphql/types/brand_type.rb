module Types
  class BrandType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :approved, Boolean, null: false
    field :creator_id, Integer, null: true
    field :projects, [Types::ProjectType], null: false

    association_loader Brand, :projects
  end
end
