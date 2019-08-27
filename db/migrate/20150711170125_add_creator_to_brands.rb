class AddCreatorToBrands < ActiveRecord::Migration[4.2]
  def change
    change_table :brands do |t|
      t.references :creator
    end
  end
end
