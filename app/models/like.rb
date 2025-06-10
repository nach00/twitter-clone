# app/models/like.rb
class Like < ApplicationRecord
  belongs_to :user
  belongs_to :tweet, counter_cache: :likes_count

  validates :user_id, presence: true
  validates :tweet_id, presence: true
  validates :user_id, uniqueness: { scope: :tweet_id }
end
