class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception # Default
  # If serving React app and API from same domain, CSRF from Doc 25 is needed
  # For now, we used skip_before_action :verify_authenticity_token in API controllers
  # A better approach for APIs is token-based auth.
end
