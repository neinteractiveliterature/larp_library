class CreateBrandMemberships < ActiveRecord::Migration[4.2]
  def change
    create_table :brand_memberships do |t|
      t.references :brand, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.boolean :admin

      t.timestamps null: false
    end
  end
end
