class AddFacilitatorCountsToProjects < ActiveRecord::Migration[6.1]
  def change
    change_table :projects do |t|
      t.integer :min_facilitators
      t.integer :max_facilitators
    end
  end
end
