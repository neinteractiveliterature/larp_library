module Types
  class ProjectType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :authors, String, null: true
    field :license, Types::LicenseType, null: true
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :min_players, Integer, null: true
    field :max_players, Integer, null: true
    field :length_quantity, Integer, null: true
    field :length_units, String, null: true
    field :publication_year, Integer, null: true
    field :brand, Types::BrandType, null: true
    field :project_files, [Types::ProjectFileType], null: false
    field :tags, [Types::TagType], null: false

    association_loaders Project, :brand, :project_files, :tags

    def license
      Project::LICENSES[object.license.to_sym]&.merge(id: object.license)
    end
  end
end
