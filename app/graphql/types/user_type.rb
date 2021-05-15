module Types
  class UserType < Types::BaseObject
    perform_authorization

    field :id, ID, null: false
    field :username, String, null: false
    field :email, String, null: true
    field :firstname, String, null: true
    field :lastname, String, null: true
    field :admin, Boolean, null: true
  end
end
