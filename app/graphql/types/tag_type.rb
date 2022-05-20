# frozen_string_literal: true
module Types
  class TagType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tag_category, Types::TagCategoryType, null: true
    field :projects, Types::ProjectType.connection_type, null: false

    association_loaders Tag, :tag_category, :projects
  end
end
