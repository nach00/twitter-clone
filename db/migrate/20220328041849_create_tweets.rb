class CreateChirps < ActiveRecord::Migration[7.2]
  def change
    create_table :chirps do |t|
      t.references :user, null: false, foreign_key: true
      t.text :content, null: false, limit: 280
      t.integer :likes_count, default: 0, null: false

      t.timestamps
    end

    add_index :chirps, :created_at
    add_index :chirps, %i[user_id created_at]
  end
end
