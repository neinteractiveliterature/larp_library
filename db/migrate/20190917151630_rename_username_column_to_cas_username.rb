class RenameUsernameColumnToCasUsername < ActiveRecord::Migration
  def change
    rename_column :users, :username, :cas_username
  end
end
