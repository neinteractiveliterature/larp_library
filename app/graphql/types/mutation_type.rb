module Types
  class MutationType < Types::BaseObject
    field :create_project, mutation: Mutations::CreateProject
    field :update_project, mutation: Mutations::UpdateProject
    field :delete_project, mutation: Mutations::DeleteProject

    field :complete_project_file_upload, mutation: Mutations::CompleteProjectFileUpload
    field :delete_project_file, mutation: Mutations::DeleteProjectFile
  end
end
