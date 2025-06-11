
// frontend/src/components/TweetCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tweet } from "@/types/tweet";
import { tweetService } from "@/services/tweetService";

interface TweetCardProps {
  tweet: Tweet;
  onTweetDeleted: (tweetId: number) => void;
  onTweetLiked: (tweetId: number, newLikesCount: number) => void;
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  onTweetDeleted,
  onTweetLiked,
}) => {
  const { user: currentUser } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(tweet.is_liked_by_current_user);
  const [likesCount, setLikesCount] = useState(tweet.likes_count);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      let response;
      if (isLiked) {
        response = await tweetService.unlikeTweet(tweet.id);
        setIsLiked(false);
      } else {
        response = await tweetService.likeTweet(tweet.id);
        setIsLiked(true);
      }
      setLikesCount(response.likes_count);
      onTweetLiked(tweet.id, response.likes_count);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;

    setIsDeleting(true);
    try {
      await tweetService.deleteTweet(tweet.id);
      onTweetDeleted(tweet.id);
    } catch (error) {
      console.error("Failed to delete tweet:", error);
      alert("Failed to delete tweet. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = currentUser?.id === tweet.user.id;

  return (
    <article className="tweet-card">
      <header className="tweet-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
          <div className="profile-picture-container">
            {tweet.user.profile_picture_url ? (
              <img
                src={tweet.user.profile_picture_url}
                alt={`${tweet.user.username}'s avatar`}
                className="profile-picture"
                style={{ width: '48px', height: '48px' }}
              />
            ) : (
              <div
                className="profile-picture bg-signature"
                style={{ 
                  width: '48px', 
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--pure-black)',
                  fontWeight: 'var(--font-weight-black)'
                }}
              >
                {tweet.user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <div className="tweet-meta">
              <Link
                to={`/profile/${tweet.user.username}`}
                className="weight-black"
                style={{ marginRight: 'var(--space-sm)' }}
              >
                @{tweet.user.username}
              </Link>
              <span>· {tweet.time_ago}</span>
            </div>
            
            <div className="tweet-content">
              {tweet.message}
            </div>
            
            {tweet.image_url && (
              <img
                src={tweet.image_url}
                alt="Tweet image"
                style={{ 
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  border: '2px solid var(--pure-black)',
                  borderRadius: 'var(--radius-sharp)',
                  marginTop: 'var(--space-md)'
                }}
              />
            )}
          </div>
          
          {isOwner && (
            <button
              className="btn btn-outline"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ fontSize: '0.75rem', padding: 'var(--space-xs) var(--space-sm)' }}
            >
              {isDeleting ? "..." : "DELETE"}
            </button>
          )}
        </div>
      </header>

      <footer className="tweet-actions">
        <button
          className={`tweet-action ${isLiked ? 'active' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          {isLiking ? "..." : `${isLiked ? "♥" : "♡"} ${likesCount}`}
        </button>
      </footer>
    </article>
  );
};
