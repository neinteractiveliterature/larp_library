module Types
  class BrandMembershipType < Types::BaseObject
    perform_authorization

    field :id, ID, null: false
    field :brand, Types::BrandType, null: false
    field :user, Types::UserType, null: true
    field :admin, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :invitation_email, String, null: true

    association_loaders BrandMembership, :brand, :user
  end
end
