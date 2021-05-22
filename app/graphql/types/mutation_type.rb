module Types
  class MutationType < Types::BaseObject
    field :create_brand, mutation: Mutations::CreateBrand
    field :update_brand, mutation: Mutations::UpdateBrand

    field :invite_brand_member, mutation: Mutations::InviteBrandMember
    field :delete_brand_membership, mutation: Mutations::DeleteBrandMembership

    field :create_project, mutation: Mutations::CreateProject
    field :update_project, mutation: Mutations::UpdateProject
    field :delete_project, mutation: Mutations::DeleteProject

    field :complete_project_file_upload, mutation: Mutations::CompleteProjectFileUpload
    field :delete_project_file, mutation: Mutations::DeleteProjectFile
  end
end
