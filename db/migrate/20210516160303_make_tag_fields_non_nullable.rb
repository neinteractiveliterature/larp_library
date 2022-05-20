# frozen_string_literal: true
class MakeTagFieldsNonNullable < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tags, :name, false
    change_column_null :tag_categories, :name, false
  end
end
