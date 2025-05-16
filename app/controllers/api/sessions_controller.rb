module Api
  class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token # For API

    def create
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        session[:user_id] = user.id # Simple session management
        render json: { success: true, user: { id: user.id, username: user.username, email: user.email } }, status: :ok
      else
        render json: { success: false, error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    def destroy
      session.delete(:user_id)
      render json: { success: true, message: 'Logged out' }, status: :ok
    end

    def logged_in_user # Helper to check if user is logged in
      user = User.find_by(id: session[:user_id])
      if user
        render json: { logged_in: true, user: { id: user.id, username: user.username, email: user.email } }
      else
        render json: { logged_in: false }
      end
    end
  end
end
