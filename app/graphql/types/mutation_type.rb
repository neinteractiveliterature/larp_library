module Types
  class MutationType < Types::BaseObject
    field :complete_project_file_upload, mutation: Mutations::CompleteProjectFileUpload
    field :delete_project_file, mutation: Mutations::DeleteProjectFile
  end
end
