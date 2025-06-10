# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!, except: %i[show search followers following]
      before_action :set_user, only: %i[show follow unfollow followers following]

      # GET /api/v1/users/:username
      def show
        render json: UserSerializer.new(@user, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/me
      def me
        render json: UserSerializer.new(current_user).serializable_hash
      end

      # PUT /api/v1/me
      def update_me
        if current_user.update(user_update_params)
          render json: UserSerializer.new(current_user).serializable_hash
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/users/:username/follow
      def follow
        return render json: { error: 'Cannot follow yourself' }, status: :unprocessable_entity if @user == current_user

        relationship = current_user.active_relationships.build(followed: @user)

        if relationship.save
          @user.increment!(:followers_count)
          current_user.increment!(:following_count)
          render json: { message: 'Successfully followed user' }, status: :created
        else
          render json: { errors: relationship.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:username/unfollow
      def unfollow
        relationship = current_user.active_relationships.find_by(followed: @user)

        if relationship&.destroy
          @user.decrement!(:followers_count)
          current_user.decrement!(:following_count)
          head :no_content
        else
          render json: { error: 'Not following this user' }, status: :not_found
        end
      end

      # GET /api/v1/users/:username/followers
      def followers
        followers = @user.followers.includes(:active_relationships)
        render json: UserSerializer.new(followers, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/users/:username/following
      def following
        following = @user.following.includes(:passive_relationships)
        render json: UserSerializer.new(following, { params: { current_user: current_user } }).serializable_hash
      end

      # GET /api/v1/search/users/:keyword
      def search
        users = User.where('username ILIKE ? OR email ILIKE ?', "%#{params[:keyword]}%", "%#{params[:keyword]}%")
                    .limit(20)
        render json: UserSerializer.new(users, { params: { current_user: current_user } }).serializable_hash
      end

      private

      def set_user
        @user = User.find_by!(username: params[:username])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end

      def user_update_params
        params.require(:user).permit(:bio, :profile_picture_url)
      end
    end
  end
end
