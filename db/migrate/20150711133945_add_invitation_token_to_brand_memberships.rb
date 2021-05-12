class AddInvitationTokenToBrandMemberships < ActiveRecord::Migration[4.2]
  def change
    change_table :brand_memberships do |t|
      t.text :invitation_token
      t.text :invitation_email
    end

    add_index :brand_memberships, [:brand_id, :invitation_token], unique: true
  end
end
