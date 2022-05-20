# frozen_string_literal: true
module Types
  class TagCategoryAttributes < Types::BaseInputObject
    argument :name, String, required: false
    argument :color, String, required: false
    argument :icon, String, required: false
  end
end
