class CreateProjectPromotions < ActiveRecord::Migration
  def change
    create_table :project_promotions do |t|
      t.references :project, index: true, foreign_key: true, null: false
      t.timestamps null: false
    end
  end
end
