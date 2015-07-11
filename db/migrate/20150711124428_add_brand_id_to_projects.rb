class AddBrandIdToProjects < ActiveRecord::Migration
  def change
    change_table :projects do |t|
      t.references :brand, index: true
    end
  end
end
