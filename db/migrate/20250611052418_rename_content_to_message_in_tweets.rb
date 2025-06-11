class RenameContentToMessageInTweets < ActiveRecord::Migration[7.2]
  def change
    # Only rename if content column exists (for production)
    if column_exists?(:tweets, :content) && !column_exists?(:tweets, :message)
      rename_column :tweets, :content, :message
    end
  end
end
