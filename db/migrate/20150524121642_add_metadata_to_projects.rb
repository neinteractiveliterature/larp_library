# frozen_string_literal: true
class AddMetadataToProjects < ActiveRecord::Migration[4.2]
  def change
    change_table :projects, bulk: true do |t|
      t.integer :min_players
      t.integer :max_players
      t.integer :length_quantity
      t.string :length_units
      t.integer :publication_year
    end
  end
end
