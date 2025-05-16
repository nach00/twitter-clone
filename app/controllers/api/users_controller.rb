module Api
  class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token # For API, or handle differently

    def create
      user = User.new(user_params)
      if user.save
        render json: { success: true, user: { id: user.id, username: user.username, email: user.email } }, status: :created
      else
        render json: { success: false, errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation)
    end
  end
end
