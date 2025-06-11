# app/serializers/tweet_serializer.rb
class TweetSerializer
  include JSONAPI::Serializer

  attributes :id, :message, :likes_count, :created_at, :updated_at

  attribute :user do |tweet|
    UserSerializer.new(tweet.user).serializable_hash[:data][:attributes]
  end

  attribute :image_url do |tweet|
    tweet.image_url if tweet.image.attached?
  end

  attribute :is_liked_by_current_user do |tweet, params|
    if params && params[:current_user]
      tweet.liked_by?(params[:current_user])
    else
      false
    end
  end

  attribute :time_ago do |tweet|
    time_diff = Time.current - tweet.created_at

    case time_diff
    when 0..59
      "#{time_diff.to_i}s"
    when 60..3599
      "#{(time_diff / 60).to_i}m"
    when 3600..86_399
      "#{(time_diff / 3600).to_i}h"
    else
      "#{(time_diff / 86_400).to_i}d"
    end
  end
end
