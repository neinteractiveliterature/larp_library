module Types
  class UserType < Types::BaseObject
    perform_authorization

    field :id, ID, null: false
    field :username, String, null: false
    field :email, String, null: true
    field :firstname, String, null: true
    field :lastname, String, null: true
    field :name, String, null: false
    field :admin, Boolean, null: true
    field :brands, [Types::BrandType], null: false
    field :brand_memberships, [Types::BrandMembershipType], null: false

    association_loaders User, :brands, :brand_memberships
  end
end
