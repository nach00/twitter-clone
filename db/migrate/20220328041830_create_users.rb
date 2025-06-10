class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :username, null: false, limit: 30
      t.string :email, null: false, limit: 255
      t.string :password_digest, null: false
      t.text :bio, limit: 160
      t.string :profile_picture_url
      t.integer :chirps_count, default: 0, null: false
      t.integer :followers_count, default: 0, null: false
      t.integer :following_count, default: 0, null: false

      t.timestamps
    end

    add_index :users, :username, unique: true
    add_index :users, :email, unique: true
  end
end
