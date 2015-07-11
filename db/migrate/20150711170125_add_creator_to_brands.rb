class AddCreatorToBrands < ActiveRecord::Migration
  def change
    change_table :brands do |t|
      t.references :creator
    end
  end
end
