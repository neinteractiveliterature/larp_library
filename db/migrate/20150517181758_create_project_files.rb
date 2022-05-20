# frozen_string_literal: true
class CreateProjectFiles < ActiveRecord::Migration[4.2]
  def change
    create_table :project_files do |t|
      t.references :project, index: true, foreign_key: true
      t.string :url
      t.string :filename
      t.string :filetype
      t.integer :filesize
      t.string :filepath
      t.references :uploader

      t.timestamps null: false
    end

    add_foreign_key :project_files, :users, column: "uploader_id"
  end
end
