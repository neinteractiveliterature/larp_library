module Types
  class ProjectFileType < Types::BaseObject
    field :id, ID, null: false
    field :project, Types::ProjectType, null: false
    field :url, String, null: false
    field :filename, String, null: false
    field :filetype, String, null: true
    field :filesize, Integer, null: false
    field :filepath, String, null: false
    field :uploader_id, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    association_loader ProjectFile, :project
  end
end
