# db/migrate/[timestamp]_create_likes.rb
class CreateLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tweet, null: false, foreign_key: true

      t.timestamps
    end

    add_index :likes, %i[user_id tweet_id], unique: true unless index_exists?(:likes, %i[user_id tweet_id])
    add_index :likes, :tweet_id unless index_exists?(:likes, :tweet_id)
  end
end
