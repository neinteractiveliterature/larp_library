module Types
  class MutationType < Types::BaseObject
    field :create_brand, mutation: Mutations::CreateBrand
    field :update_brand, mutation: Mutations::UpdateBrand
    field :approve_brand, mutation: Mutations::ApproveBrand

    field :invite_brand_member, mutation: Mutations::InviteBrandMember
    field :delete_brand_membership, mutation: Mutations::DeleteBrandMembership
    field :accept_brand_membership_invitation, mutation: Mutations::AcceptBrandMembershipInvitation

    field :create_project, mutation: Mutations::CreateProject
    field :update_project, mutation: Mutations::UpdateProject
    field :delete_project, mutation: Mutations::DeleteProject
    field :promote_project, mutation: Mutations::PromoteProject
    field :unpromote_project, mutation: Mutations::UnpromoteProject

    field :complete_project_file_upload, mutation: Mutations::CompleteProjectFileUpload
    field :delete_project_file, mutation: Mutations::DeleteProjectFile

    field :create_project_link, mutation: Mutations::CreateProjectLink
    field :update_project_link, mutation: Mutations::UpdateProjectLink
    field :move_project_link, mutation: Mutations::MoveProjectLink
    field :delete_project_link, mutation: Mutations::DeleteProjectLink

    field :create_tag, mutation: Mutations::CreateTag
    field :update_tag, mutation: Mutations::UpdateTag
    field :delete_tag, mutation: Mutations::DeleteTag

    field :create_tag_category, mutation: Mutations::CreateTagCategory
    field :update_tag_category, mutation: Mutations::UpdateTagCategory
    field :delete_tag_category, mutation: Mutations::DeleteTagCategory
  end
end
