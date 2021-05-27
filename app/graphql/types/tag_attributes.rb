module Types
  class TagAttributes < Types::BaseInputObject
    argument :name, String, required: false
    argument :tag_category_id, ID, required: false
  end
end
