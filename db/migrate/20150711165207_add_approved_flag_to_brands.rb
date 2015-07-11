class AddApprovedFlagToBrands < ActiveRecord::Migration
  def change
    add_column :brands, :approved, :boolean, null: false, default: false
  end
end
