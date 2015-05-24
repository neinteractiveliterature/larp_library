class AddMetadataToProjects < ActiveRecord::Migration
  def change
    change_table :projects do |t|
      t.integer :min_players
      t.integer :max_players
      t.integer :length_quantity
      t.string :length_units
      t.integer :publication_year
    end
  end
end
