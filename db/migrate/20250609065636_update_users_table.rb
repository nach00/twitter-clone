# db/migrate/[timestamp]_update_users_table.rb
class UpdateUsersTable < ActiveRecord::Migration[7.2]
  def change
    # Add new columns if they don't exist
    add_column :users, :bio, :text, limit: 160 unless column_exists?(:users, :bio)
    add_column :users, :profile_picture_url, :string unless column_exists?(:users, :profile_picture_url)
    add_column :users, :tweets_count, :integer, default: 0, null: false unless column_exists?(:users, :tweets_count)
    add_column :users, :followers_count, :integer, default: 0, null: false unless column_exists?(:users, :followers_count)
    add_column :users, :following_count, :integer, default: 0, null: false unless column_exists?(:users, :following_count)

    # Add password_digest if it doesn't exist (for has_secure_password)
    add_column :users, :password_digest, :string unless column_exists?(:users, :password_digest)

    # Add indexes if they don't exist
    add_index :users, :username, unique: true unless index_exists?(:users, :username)
    add_index :users, :email, unique: true unless index_exists?(:users, :email)

    # Update username length constraint
    change_column :users, :username, :string, limit: 30 if column_exists?(:users, :username)
  end
end
