# db/migrate/[timestamp]_create_relationships.rb
class CreateRelationships < ActiveRecord::Migration[7.2]
  def change
    create_table :relationships do |t|
      t.references :follower, null: false, foreign_key: { to_table: :users }
      t.references :followed, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :relationships, %i[follower_id followed_id], unique: true unless index_exists?(:relationships, %i[follower_id followed_id])
    add_index :relationships, :followed_id unless index_exists?(:relationships, :followed_id)
  end
end
