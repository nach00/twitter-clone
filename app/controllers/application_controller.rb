# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :set_cors_headers

  attr_reader :current_user

  def fallback_index_html
    respond_to do |format|
      format.html { render file: Rails.public_path.join('dist', 'index.html'), layout: false }
      format.all { render json: { error: 'Not Found' }, status: :not_found }
    end
  rescue ActionView::MissingTemplate
    render json: {
      error: 'Frontend not built. Run: cd frontend && npm run build'
    }, status: :service_unavailable
  end

  def serve_frontend_asset
    asset_path = params[:path]
    file_path = Rails.public_path.join('dist', 'assets', asset_path)
    
    if File.exist?(file_path)
      content_type = case File.extname(asset_path)
                     when '.css' then 'text/css'
                     when '.js' then 'application/javascript'
                     else 'application/octet-stream'
                     end
      
      send_file file_path, type: content_type, disposition: 'inline'
    else
      render json: { error: 'Asset not found' }, status: :not_found
    end
  end

  protected

  def authenticate_user!
    token = extract_token_from_header
    if token
      begin
        decoded_token = JWT.decode(token, jwt_secret, true, algorithm: 'HS256')
        user_id = decoded_token[0]['user_id']
        @current_user = User.find_by(id: user_id)
        render json: { error: 'Invalid token - user not found' }, status: :unauthorized unless @current_user
      rescue JWT::DecodeError, JWT::ExpiredSignature => e
        render json: { error: "Invalid token: #{e.message}" }, status: :unauthorized
      end
    else
      render json: { error: 'No token provided' }, status: :unauthorized
    end
  end

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      username: user.username,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, jwt_secret, 'HS256')
  end

  def extract_current_user_if_authenticated
    token = extract_token_from_header
    return nil unless token

    begin
      decoded_token = JWT.decode(token, jwt_secret, true, algorithm: 'HS256')
      user_id = decoded_token[0]['user_id']
      User.find_by(id: user_id)
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end

  private

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')

    auth_header.split(' ').last
  end

  def jwt_secret
    Rails.application.credentials.jwt_secret || ENV['JWT_SECRET'] || 'fallback_secret_for_development'
  end

  def set_cors_headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
  end
end
