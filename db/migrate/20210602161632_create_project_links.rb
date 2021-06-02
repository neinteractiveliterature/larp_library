class CreateProjectLinks < ActiveRecord::Migration[6.1]
  def change
    create_table :project_links do |t|
      t.references :project, null: false, foreign_key: true
      t.text :url, null: false
      t.text :title, null: false
      t.integer :position, null: false
      t.text :icon

      t.timestamps
    end
  end
end
