# app/controllers/api/v1/auth_controller.rb
module Api
  module V1
    class AuthController < ApplicationController
      # POST /api/v1/auth/register
      def register
        @user = User.new(user_params)

        if @user.save
          token = generate_jwt_token(@user)
          render json: {
            user: UserSerializer.new(@user).serializable_hash[:data][:attributes],
            token: token
          }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email]&.downcase)

        if user&.authenticate(params[:password])
          token = generate_jwt_token(user)
          render json: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          }
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      # GET /api/v1/auth/me
      def me
        authenticate_user!
        return if performed?
        
        render json: UserSerializer.new(current_user).serializable_hash
      end

      # DELETE /api/v1/auth/logout
      def logout
        # With JWT, logout is handled client-side by removing the token
        render json: { message: 'Successfully logged out' }
      end

      private

      def user_params
        params.require(:user).permit(:username, :email, :password, :password_confirmation)
      end
    end
  end
end
