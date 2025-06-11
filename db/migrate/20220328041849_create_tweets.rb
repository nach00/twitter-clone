class CreateTweets < ActiveRecord::Migration[7.2]
  def change
    create_table :tweets do |t|
      t.references :user, null: false, foreign_key: true
      t.text :content, null: false, limit: 280
      t.integer :likes_count, default: 0, null: false

      t.timestamps
    end

    add_index :tweets, :created_at
    add_index :tweets, %i[user_id created_at]
  end
end
