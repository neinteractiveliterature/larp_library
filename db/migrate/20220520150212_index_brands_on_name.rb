# frozen_string_literal: true
class IndexBrandsOnName < ActiveRecord::Migration[6.1]
  def change
    add_index :brands, :name, unique: true
  end
end
