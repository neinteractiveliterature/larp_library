module Types
  class ProjectType < Types::BaseObject
    perform_authorization

    field :id, ID, null: false
    field :title, String, null: true
    field :authors, String, null: true
    field :license, Types::LicenseType, null: true
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :min_players, Integer, null: true
    field :max_players, Integer, null: true
    field :min_facilitators, Integer, null: true
    field :max_facilitators, Integer, null: true
    field :length_quantity, Integer, null: true
    field :length_units, String, null: true
    field :publication_year, Integer, null: true
    field :brand, Types::BrandType, null: false
    field :project_files, [Types::ProjectFileType], null: false
    field :project_links, [Types::ProjectLinkType], null: false
    field :tags, [Types::TagType], null: false
    field :current_user_can_edit, Boolean, null: false
    field :current_user_can_delete, Boolean, null: false
    field :current_user_can_upload_files, Boolean, null: false
    field :current_user_can_delete_files, Boolean, null: false

    association_loaders Project, :brand, :project_files, :project_links, :tags

    def license
      return nil unless object.license.present?
      Project::LICENSES[object.license.to_sym]&.merge(id: object.license)
    end

    def current_user_can_edit
      context[:current_ability].can?(:edit, object)
    end

    def current_user_can_delete
      context[:current_ability].can?(:delete, object)
    end

    def current_user_can_upload_files
      context[:current_ability].can?(:create, ProjectFile.new(project: object))
    end

    def current_user_can_delete_files
      context[:current_ability].can?(:delete, ProjectFile.new(project: object))
    end
  end
end
