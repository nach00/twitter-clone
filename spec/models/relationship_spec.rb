require 'rails_helper'

RSpec.describe Relationship, type: :model do
  describe 'associations' do
    it 'belongs to follower' do
      expect(Relationship.reflect_on_association(:follower).macro).to eq(:belongs_to)
      expect(Relationship.reflect_on_association(:follower).class_name).to eq('User')
    end

    it 'belongs to followed' do
      expect(Relationship.reflect_on_association(:followed).macro).to eq(:belongs_to)
      expect(Relationship.reflect_on_association(:followed).class_name).to eq('User')
    end
  end

  describe 'validations' do
    let(:follower) { create(:user) }
    let(:followed) { create(:user) }

    it 'requires follower_id' do
      relationship = Relationship.new(followed: followed)
      expect(relationship).not_to be_valid
      expect(relationship.errors[:follower_id]).to include("can't be blank")
    end

    it 'requires followed_id' do
      relationship = Relationship.new(follower: follower)
      expect(relationship).not_to be_valid
      expect(relationship.errors[:followed_id]).to include("can't be blank")
    end
    
    it 'validates uniqueness of follower_id scoped to followed_id' do
      create(:relationship, follower: follower, followed: followed)
      
      duplicate_relationship = build(:relationship, follower: follower, followed: followed)
      expect(duplicate_relationship).not_to be_valid
      expect(duplicate_relationship.errors[:follower_id]).to include('has already been taken')
    end

    it 'prevents users from following themselves' do
      user = create(:user)
      relationship = build(:relationship, follower: user, followed: user)
      
      expect(relationship).not_to be_valid
      expect(relationship.errors[:follower_id]).to include("can't follow yourself")
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      relationship = create(:relationship)
      expect(relationship).to be_valid
      expect(relationship).to be_persisted
    end
  end
end