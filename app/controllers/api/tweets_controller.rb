module Api
  class TweetsController < ApplicationController
    skip_before_action :verify_authenticity_token # For API
    before_action :require_login, only: %i[create destroy]

    def index
      tweets = Tweet.includes(:user).all # Eager load user to prevent N+1
      render json: tweets_with_username(tweets)
    end

    def create
      tweet = @current_user.tweets.new(tweet_params)
      if tweet.save
        render json: tweet_with_username(tweet), status: :created
      else
        render json: { errors: tweet.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      tweet = @current_user.tweets.find_by(id: params[:id])
      if tweet
        tweet.destroy
        render json: { success: true, message: 'Tweet deleted' }, status: :ok
      else
        render json: { error: 'Tweet not found or not authorized' }, status: :not_found
      end
    end

    def user_tweets # For user profile page
      user = User.find_by(username: params[:username])
      if user
        tweets = user.tweets.includes(:user) # Eager load user
        render json: tweets_with_username(tweets)
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end

    private

    def tweet_params
      params.require(:tweet).permit(:content)
    end

    def require_login
      @current_user = User.find_by(id: session[:user_id])
      return if @current_user

      render json: { error: 'You must be logged in' }, status: :unauthorized
    end

    # Helper to include username in tweet JSON
    def tweets_with_username(tweets_collection)
      if tweets_collection.respond_to?(:map) # Check if it's a collection
        tweets_collection.map do |tweet|
          tweet.as_json.merge(username: tweet.user.username)
        end
      else # Single tweet object
        tweets_collection.as_json.merge(username: tweets_collection.user.username)
      end
    end

    def tweet_with_username(tweet_object) # Ensure this method name is unique
      tweet_object.as_json.merge(username: tweet_object.user.username)
    end
  end
end
