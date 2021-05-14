module Types
  class BrandType < Types::BaseObject
    perform_authorization

    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :approved, Boolean, required_permission: :manage, null: true
    field :projects, Types::ProjectType.connection_type, null: false
    field :creator, Types::UserType, null: true
    field :users, [Types::UserType], null: false

    association_loaders Brand, :projects, :creator, :users
  end
end
