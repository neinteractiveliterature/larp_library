# frozen_string_literal: true
module Types
  class ProjectAttributes < Types::BaseInputObject
    argument :title, String, required: false
    argument :authors, String, required: false
    argument :description, String, required: false
    argument :license_id, ID, required: false
    argument :publication_year, Int, required: false
    argument :min_players, Int, required: false
    argument :max_players, Int, required: false
    argument :min_facilitators, Int, required: false
    argument :max_facilitators, Int, required: false
    argument :length_quantity, Int, required: false
    argument :length_units, String, required: false
    argument :tag_names, [String], required: false
  end
end
