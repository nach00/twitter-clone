user = User.create!(username: "testuser", email: "test@example.com", password: "password123")
puts "Created user: #{user.username}"

controller = ApplicationController.new
token = controller.send(:generate_jwt_token, user)
puts "Generated token: #{token[0..50]}..."

decoded = JWT.decode(token, controller.send(:jwt_secret), true, algorithm: "HS256")
puts "Token decoded successfully: #{decoded}"

user.destroy
puts "Test completed successfully!"