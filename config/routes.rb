Rails.application.routes.draw do
  get "static_pages/index"
  namespace :api do
    resources :users, only: [:create]
    resources :tweets, only: %i[index create destroy]
    get '/tweets/user/:username', to: 'tweets#user_tweets' # For user profile

    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/logged_in_user', to: 'sessions#logged_in_user' # Check login status
  end

  # Frontend Routes - All will be handled by React Router
  # This needs to come AFTER API routes
  root 'static_pages#index' # Your main React app entry point
  get '*path', to: 'static_pages#index', via: :all # Catches all other paths
end
