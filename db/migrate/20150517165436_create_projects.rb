# frozen_string_literal: true
class CreateProjects < ActiveRecord::Migration[4.2]
  def change
    create_table :projects do |t|
      t.text :title
      t.text :authors
      t.text :license
      t.text :description

      t.timestamps null: false
    end
  end
end
