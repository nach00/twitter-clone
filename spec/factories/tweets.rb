FactoryBot.define do
  factory :tweet do
    message { 'Test Message' }
    association :user
  end
end
