# frozen_string_literal: true
class AddFilepathIndexOnProjectFiles < ActiveRecord::Migration[7.0]
  def change
    add_index :project_files, :filepath, unique: true
  end
end
