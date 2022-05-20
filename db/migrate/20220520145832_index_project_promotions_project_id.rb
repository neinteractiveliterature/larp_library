# frozen_string_literal: true
class IndexProjectPromotionsProjectId < ActiveRecord::Migration[6.1]
  def change
    remove_index :project_promotions, :project_id
    add_index :project_promotions, :project_id, unique: true
  end
end
