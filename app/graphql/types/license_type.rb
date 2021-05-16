module Types
  class LicenseType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :url, String, null: false
    field :logo_url, String, null: false
    field :dedication_html, String, null: true
  end
end
