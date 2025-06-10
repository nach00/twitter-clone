# ~/github/altcademy/twitter-clone/config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:5173', '127.0.0.1:5173' # Vite dev server

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head]
  end
end
