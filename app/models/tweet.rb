# app/models/tweet.rb
class Tweet < ApplicationRecord
  belongs_to :user, counter_cache: :tweets_count
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_one_attached :image

  # Validations
  validates :user, presence: true
  validates :message, presence: true, length: { minimum: 1, maximum: 280 }

  # Callbacks
  before_validation :strip_message

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :with_includes, -> { includes(:user, :likes, image_attachment: :blob) }
  scope :search_content, ->(term) { where('message ILIKE ?', "%#{term}%") }

  # Instance methods
  def liked_by?(user)
    return false unless user

    likes.exists?(user: user)
  end

  def like_count
    likes_count || 0
  end

  def image_url
    return nil unless image.attached?

    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: false)
  end

  private

  def strip_message
    self.message = message&.strip
  end
end
