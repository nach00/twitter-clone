
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
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex">
            <div className="me-3">
              {tweet.user.profile_picture_url ? (
                <img
                  src={tweet.user.profile_picture_url}
                  alt={`${tweet.user.username}'s avatar`}
                  className="rounded-circle"
                  width="48"
                  height="48"
                />
              ) : (
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                  style={{ width: "48px", height: "48px" }}
                >
                  {tweet.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1">
                <Link
                  to={`/profile/${tweet.user.username}`}
                  className="text-decoration-none fw-bold me-2"
                >
                  @{tweet.user.username}
                </Link>
                <small className="text-muted">· {tweet.time_ago}</small>
              </div>
              <p className="mb-2">{tweet.message}</p>
              {tweet.image_url && (
                <img
                  src={tweet.image_url}
                  alt="Tweet image"
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: "300px" }}
                />
              )}
            </div>
          </div>
          {isOwner && (
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                ⋯
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Tweet"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="d-flex align-items-center mt-2">
          <button
            className={`btn btn-sm ${
              isLiked ? "btn-danger" : "btn-outline-danger"
            } me-3`}
            onClick={handleLike}
            disabled={isLiking}
          >
            {isLiking ? (
              <span className="spinner-border spinner-border-sm me-1" />
            ) : (
              <span>{isLiked ? "❤️" : "🤍"}</span>
            )}
            {likesCount}
          </button>
        </div>
      </div>
    </div>
  );
};
