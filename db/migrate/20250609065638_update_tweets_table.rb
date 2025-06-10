# db/migrate/[timestamp]_update_tweets_table.rb
class UpdateTweetsTable < ActiveRecord::Migration[7.2]
  def change
    # Add likes_count column if it doesn't exist
    add_column :tweets, :likes_count, :integer, default: 0, null: false unless column_exists?(:tweets, :likes_count)

    # Add indexes for better performance
    add_index :tweets, :created_at unless index_exists?(:tweets, :created_at)
    add_index :tweets, %i[user_id created_at] unless index_exists?(:tweets, %i[user_id created_at])

    # Update message length constraint to 280 characters
    change_column :tweets, :message, :text, limit: 280 if column_exists?(:tweets, :message)
  end
end
