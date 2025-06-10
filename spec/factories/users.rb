FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@test.com" }
    sequence(:username) { |n| "testuser#{n}" }
    password { 'testtest' }
  end
end
