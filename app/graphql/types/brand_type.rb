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
    field :current_user_can_edit, Boolean, null: false
    field :current_user_can_create_projects, Boolean, null: false
    field :current_user_can_manage_memberships, Boolean, null: false
    field :brand_memberships, [Types::BrandMembershipType], null: false

    association_loaders Brand, :projects, :creator, :users, :brand_memberships

    def current_user_can_edit
      context[:current_ability].can?(:edit, object)
    end

    def current_user_can_create_projects
      context[:current_ability].can?(:create, Project.new(brand: object))
    end

    def current_user_can_manage_memberships
      context[:current_ability].can?(:manage, BrandMembership.new(brand: object))
    end
  end
end
