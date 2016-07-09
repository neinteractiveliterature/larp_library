class CreateTagCategories < ActiveRecord::Migration
  def change
    create_table :tag_categories do |t|
      t.text :name, index: { unique: true }
      t.text :color
      t.text :icon

      t.timestamps null: false
    end

    create_join_table :tags, :tag_categories do |t|
      t.index :tag_id
      t.index :tag_category_id
    end
  end
end
