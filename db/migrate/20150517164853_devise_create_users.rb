# frozen_string_literal: true
class DeviseCreateUsers < ActiveRecord::Migration[4.2]
  def change
    create_table(:users) do |t|
      ## CAS authenticatable
      t.string :username,           null: false, default: ""

      t.string :email
      t.string :firstname
      t.string :lastname

      t.boolean :admin, default: false

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip


      t.timestamps
    end

    add_index :users, :username,             unique: true
  end
end
