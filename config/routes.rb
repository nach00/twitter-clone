# ~/github/altcademy/twitter-clone/config/routes.rb

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      post '/auth/register', to: 'auth#register'
      post '/auth/login', to: 'auth#login'
      delete '/auth/logout', to: 'auth#logout'
      get '/auth/me', to: 'auth#me'

      # Users
      resources :users, param: :username, only: [:show] do
        member do
          post :follow
          delete :unfollow
          get :followers
          get :following
          get :tweets, to: 'tweets#user_tweets' # Fixed route
        end
      end

      # Current user profile
      get '/me', to: 'users#me'
      put '/me', to: 'users#update_me'

      # Tweets
      resources :tweets, only: %i[index create show destroy] do
        member do
          post :like
          delete :unlike
        end
      end

      # Feed
      get '/feed', to: 'tweets#feed'

      # Search
      get '/search/tweets/:keyword', to: 'tweets#search'
      get '/search/users/:keyword', to: 'users#search'
    end
  end

  # Serve frontend assets  
  get '/assets/*path', to: 'application#serve_frontend_asset', format: false

  root 'application#fallback_index_html'
  get '*path', to: 'application#fallback_index_html', constraints: lambda { |req|
    !req.xhr? && req.format.html?
  }
end
