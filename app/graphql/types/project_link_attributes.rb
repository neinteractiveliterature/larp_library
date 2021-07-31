module Types
  class ProjectLinkAttributes < Types::BaseInputObject
    argument :title, String, required: false
    argument :url, String, required: false
    argument :icon, String, required: false
  end
end
