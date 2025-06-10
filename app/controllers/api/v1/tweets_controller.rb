# app/controllers/api/v1/tweets_controller.rb
module Api
  module V1
    class TweetsController < ApplicationController
      before_action :authenticate_user!, except: %i[index show search user_tweets]
      before_action :set_tweet, only: %i[show destroy like unlike]
      before_action :ensure_owner, only: [:destroy]

      # GET /api/v1/tweets (all tweets for explore)
      def index
        @tweets = Tweet.with_includes.recent
        @tweets = @tweets.page(params[:page]).per(params[:per_page] || 20)
        render json: TweetSerializer.new(@tweets, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/users/:username/tweets (rename this method)
      def user_tweets
        user = User.find_by!(username: params[:username])
        @tweets = user.tweets.with_includes.recent
        @tweets = @tweets.page(params[:page]).per(params[:per_page] || 20)
        render json: TweetSerializer.new(@tweets, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/feed (authenticated user's feed)
      def feed
        authenticate_user!
        @tweets = current_user.feed_tweets
        @tweets = @tweets.page(params[:page]).per(params[:per_page] || 20)
        render json: TweetSerializer.new(@tweets, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/tweets/:id
      def show
        # Get current user if authenticated (optional auth)
        user = extract_current_user_if_authenticated
        render json: TweetSerializer.new(@tweet, { params: { current_user: user } }).serializable_hash
      end

      # POST /api/v1/tweets
      def create
        @tweet = current_user.tweets.build(tweet_params)

        if @tweet.save
          render json: TweetSerializer.new(@tweet, { params: { current_user: current_user } }).serializable_hash, status: :created
        else
          render json: { errors: @tweet.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/tweets/:id
      def destroy
        @tweet.destroy
        head :no_content
      end

      # POST /api/v1/tweets/:id/like
      def like
        @like = current_user.likes.build(tweet: @tweet)

        if @like.save
          render json: { message: 'Tweet liked successfully', likes_count: @tweet.reload.likes_count }
        else
          render json: { errors: @like.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/tweets/:id/unlike
      def unlike
        @like = current_user.likes.find_by(tweet: @tweet)

        if @like&.destroy
          render json: { message: 'Tweet unliked successfully', likes_count: @tweet.reload.likes_count }
        else
          render json: { error: 'You have not liked this tweet' }, status: :not_found
        end
      end

      # GET /api/v1/search/tweets/:keyword
      def search
        @tweets = Tweet.search_content(params[:keyword]).with_includes.recent.limit(50)
        render json: TweetSerializer.new(@tweets, { params: { current_user: current_user } }).serializable_hash
      end

      private

      def set_tweet
        @tweet = Tweet.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Tweet not found' }, status: :not_found
      end

      def ensure_owner
        return if @tweet.user == current_user

        render json: { error: 'You can only delete your own tweets' }, status: :forbidden
      end

      def tweet_params
        params.require(:tweet).permit(:message, :image)
      end
    end
  end
end
