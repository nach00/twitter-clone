// frontend/src/pages/FollowingPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

export const FollowingPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [user, userFollowing] = await Promise.all([
          userService.getUser(username),
          userService.getFollowing(username)
        ]);
        
        setProfileUser(user);
        setFollowing(userFollowing);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load following");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [username]);

  const handleFollow = async (targetUsername: string) => {
    try {
      await userService.followUser(targetUsername);
      // Refresh the following list to update follow status
      if (username) {
        const updatedFollowing = await userService.getFollowing(username);
        setFollowing(updatedFollowing);
      }
    } catch (err: any) {
      console.error("Failed to follow user:", err);
    }
  };

  const handleUnfollow = async (targetUsername: string) => {
    try {
      await userService.unfollowUser(targetUsername);
      // Refresh the following list to update follow status
      if (username) {
        const updatedFollowing = await userService.getFollowing(username);
        setFollowing(updatedFollowing);
      }
    } catch (err: any) {
      console.error("Failed to unfollow user:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="d-flex align-items-center mb-4">
            <Link to={`/profile/${username}`} className="btn btn-outline-secondary me-3">
              ← Back to Profile
            </Link>
            <h2 className="mb-0">
              {profileUser?.username}'s Following ({following.length})
            </h2>
          </div>

          {following.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Not following anyone yet.</p>
            </div>
          ) : (
            <div className="list-group">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {followedUser.profile_picture_url ? (
                        <img
                          src={followedUser.profile_picture_url}
                          alt={`${followedUser.username}'s avatar`}
                          className="rounded-circle"
                          width="48"
                          height="48"
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                          style={{ width: "48px", height: "48px" }}
                        >
                          {followedUser.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/profile/${followedUser.username}`}
                        className="text-decoration-none fw-bold"
                      >
                        @{followedUser.username}
                      </Link>
                      {followedUser.bio && (
                        <p className="text-muted mb-0 small">{followedUser.bio}</p>
                      )}
                      <small className="text-muted">
                        {followedUser.followers_count} followers · {followedUser.following_count} following
                      </small>
                    </div>
                  </div>
                  
                  {currentUser && currentUser.username !== followedUser.username && (
                    <div>
                      {followedUser.is_following ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleUnfollow(followedUser.username)}
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleFollow(followedUser.username)}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};