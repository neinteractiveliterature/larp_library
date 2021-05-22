module Types
  class BrandAttributes < Types::BaseInputObject
    argument :name, String, required: false
    argument :description, String, required: false
  end
end
