class CreateTagCategories < ActiveRecord::Migration
  def change
    create_table :tag_categories do |t|
      t.text :name, index: { unique: true }
      t.text :color
      t.text :icon

      t.timestamps null: false
    end

    change_table :tags do |t|
      t.references :tag_category, index: true, foreign_key: true
    end
  end
end
