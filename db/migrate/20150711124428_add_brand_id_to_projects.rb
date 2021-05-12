class AddBrandIdToProjects < ActiveRecord::Migration[4.2]
  def change
    change_table :projects do |t|
      t.references :brand, index: true
    end
  end
end
