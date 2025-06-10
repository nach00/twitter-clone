# app/serializers/user_serializer.rb
class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :username, :email, :bio, :profile_picture_url,
             :tweets_count, :followers_count, :following_count, :created_at

  attribute :is_following do |user, params|
    if params && params[:current_user]
      params[:current_user].following?(user)
    else
      false
    end
  end

  attribute :is_followed_by do |user, params|
    if params && params[:current_user]
      user.following?(params[:current_user])
    else
      false
    end
  end
end
