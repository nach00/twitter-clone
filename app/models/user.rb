# app/models/user.rb
class User < ApplicationRecord
  has_secure_password

  # Associations
  has_many :tweets, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_tweets, through: :likes, source: :tweet

  # Following relationships
  has_many :active_relationships, class_name: 'Relationship',
                                  foreign_key: 'follower_id',
                                  dependent: :destroy
  has_many :passive_relationships, class_name: 'Relationship',
                                   foreign_key: 'followed_id',
                                   dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower

  # Validations
  validates :username, presence: true,
                       length: { minimum: 3, maximum: 30 },
                       uniqueness: { case_sensitive: false },
                       format: { with: /\A[a-zA-Z0-9_]+\z/, message: 'only allows letters, numbers, and underscores' }

  validates :email, presence: true,
                    length: { maximum: 255 },
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :password, length: { minimum: 8, maximum: 128 }, if: :password_required?

  validates :bio, length: { maximum: 160 }, allow_blank: true

  # Callbacks
  before_save :downcase_email
  before_save :downcase_username

  # Scopes
  scope :search_by_username, ->(term) { where('username ILIKE ?', "%#{term}%") }
  scope :search_by_email, ->(term) { where('email ILIKE ?', "%#{term}%") }

  # Instance methods
  def following?(other_user)
    following.include?(other_user)
  end

  def follow(other_user)
    return false if self == other_user || following?(other_user)

    active_relationships.create(followed: other_user)
  end

  def unfollow(other_user)
    active_relationships.find_by(followed: other_user)&.destroy
  end

  def feed_tweets
    following_ids = 'SELECT followed_id FROM relationships WHERE follower_id = :user_id'
    Tweet.where("user_id IN (#{following_ids}) OR user_id = :user_id", user_id: id)
         .includes(:user, :likes)
         .order(created_at: :desc)
  end

  def liked?(tweet)
    likes.exists?(tweet: tweet)
  end

  def to_param
    username
  end

  def display_name
    username
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end

  def downcase_username
    self.username = username.downcase if username.present?
  end

  def password_required?
    new_record? || password.present?
  end
end
