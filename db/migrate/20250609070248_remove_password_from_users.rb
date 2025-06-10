# db/migrate/[timestamp]_remove_password_from_users.rb
class RemovePasswordFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :password, :string if column_exists?(:users, :password)
    drop_table :sessions if table_exists?(:sessions)
  end
end
