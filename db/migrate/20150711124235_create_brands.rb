# frozen_string_literal: true
class CreateBrands < ActiveRecord::Migration[4.2]
  def change
    create_table :brands do |t|
      t.text :name, null: false
      t.text :slug, null: false, index: { unique: true }
      t.text :description

      t.timestamps null: false
    end
  end
end
