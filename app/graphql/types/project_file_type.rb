module Types
  class ProjectFileType < Types::BaseObject
    field :id, ID, null: false
    field :project_id, Integer, null: true
    field :url, String, null: true
    field :filename, String, null: true
    field :filetype, String, null: true
    field :filesize, Integer, null: true
    field :filepath, String, null: true
    field :uploader_id, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
