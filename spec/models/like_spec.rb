require 'rails_helper'

RSpec.describe Like, type: :model do
  describe 'associations' do
    it 'belongs to user' do
      expect(Like.reflect_on_association(:user).macro).to eq(:belongs_to)
    end

    it 'belongs to tweet' do
      expect(Like.reflect_on_association(:tweet).macro).to eq(:belongs_to)
    end
  end

  describe 'validations' do
    let(:user) { create(:user) }
    let(:tweet) { create(:tweet) }

    it 'requires user_id' do
      like = Like.new(tweet: tweet)
      expect(like).not_to be_valid
      expect(like.errors[:user_id]).to include("can't be blank")
    end

    it 'requires tweet_id' do
      like = Like.new(user: user)
      expect(like).not_to be_valid
      expect(like.errors[:tweet_id]).to include("can't be blank")
    end
    
    it 'validates uniqueness of user_id scoped to tweet_id' do
      create(:like, user: user, tweet: tweet)
      
      duplicate_like = build(:like, user: user, tweet: tweet)
      expect(duplicate_like).not_to be_valid
      expect(duplicate_like.errors[:user_id]).to include('has already been taken')
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      like = create(:like)
      expect(like).to be_valid
      expect(like).to be_persisted
    end
  end
end