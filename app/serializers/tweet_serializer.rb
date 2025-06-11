# app/serializers/tweet_serializer.rb
class TweetSerializer
  include JSONAPI::Serializer

  attributes :id, :message, :likes_count, :created_at, :updated_at

  attribute :user do |tweet|
    if tweet.user
      {
        id: tweet.user.id,
        username: tweet.user.username,
        email: tweet.user.email,
        bio: tweet.user.bio,
        profile_picture_url: tweet.user.profile_picture_url,
        tweets_count: tweet.user.tweets_count,
        followers_count: tweet.user.followers_count,
        following_count: tweet.user.following_count,
        created_at: tweet.user.created_at
      }
    else
      nil
    end
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
