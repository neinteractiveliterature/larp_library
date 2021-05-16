module Types
  class TagCategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :color, String, null: true
    field :text_color, String, null: true
    field :icon, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tags, [Types::TagType], null: false

    association_loader TagCategory, :tags
  end
end
