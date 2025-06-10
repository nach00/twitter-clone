# Gemfile
source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.4.2'

# Core Rails
gem 'bootsnap', '>= 1.18', require: false
gem 'puma', '>= 6.4'
gem 'rails', '~> 7.2'

# Database
gem 'pg', '~> 1.5'

# Authentication & Authorization
gem 'bcrypt', '~> 3.1'
gem 'jwt', '~> 2.8'

# JSON API
gem 'jbuilder', '~> 2.12'

# File Storage
gem 'aws-sdk-s3', '~> 1.146'
gem 'image_processing', '~> 1.12'

# CORS for API
gem 'rack-cors', '~> 2.0'

# Performance & Monitoring
gem 'redis', '~> 5.0'

# Mail
gem 'mail', '>= 2.8.1'

group :development, :test do
  gem 'awesome_print', '~> 1.9'
  gem 'byebug', '~> 11.1', platforms: %i[mri mingw x64_mingw]
  gem 'database_cleaner-active_record', '~> 2.1'
  gem 'dotenv-rails', '~> 3.0'
  gem 'factory_bot_rails', '~> 6.4'
  gem 'pry-rails', '~> 0.3'
  gem 'rspec-rails', '~> 6.1'
  gem 'rubocop', '~> 1.60'
  gem 'rubocop-rails', '~> 2.23'
  gem 'rubocop-rspec', '~> 2.26'
end

group :development do
  gem 'listen', '~> 3.8'
  gem 'spring', '~> 4.1'
  gem 'sqlite3', '~> 1.7'
  gem 'web-console', '>= 4.2'
end

group :production do
  # Heroku already includes pg in production
end

gem 'jsonapi-serializer', '~> 2.2'
gem 'kaminari', '~> 1.2'
