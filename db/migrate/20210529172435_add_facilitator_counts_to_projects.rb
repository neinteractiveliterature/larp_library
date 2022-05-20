# frozen_string_literal: true
class AddFacilitatorCountsToProjects < ActiveRecord::Migration[6.1]
  def change
    change_table :projects, bulk: true do |t|
      t.integer :min_facilitators
      t.integer :max_facilitators
    end
  end
end
