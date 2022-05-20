# frozen_string_literal: true
module Types
  class ProjectLinkType < Types::BaseObject
    field :id, ID, null: false
    field :project, Types::ProjectType, null: false
    field :url, String, null: false
    field :title, String, null: false
    field :icon, String, null: true
    field :position, Int, null: false

    association_loader ProjectLink, :project
  end
end
