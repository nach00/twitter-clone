// frontend/src/pages/FollowersPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

export const FollowersPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [user, userFollowers] = await Promise.all([
          userService.getUser(username),
          userService.getFollowers(username)
        ]);
        
        setProfileUser(user);
        setFollowers(userFollowers);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load followers");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [username]);

  const handleFollow = async (targetUsername: string) => {
    try {
      await userService.followUser(targetUsername);
      // Refresh the followers list to update follow status
      if (username) {
        const updatedFollowers = await userService.getFollowers(username);
        setFollowers(updatedFollowers);
      }
    } catch (err: any) {
      console.error("Failed to follow user:", err);
    }
  };

  const handleUnfollow = async (targetUsername: string) => {
    try {
      await userService.unfollowUser(targetUsername);
      // Refresh the followers list to update follow status
      if (username) {
        const updatedFollowers = await userService.getFollowers(username);
        setFollowers(updatedFollowers);
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
              {profileUser?.username}'s Followers ({followers.length})
            </h2>
          </div>

          {followers.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No followers yet.</p>
            </div>
          ) : (
            <div className="list-group">
              {followers.map((follower) => (
                <div key={follower.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {follower.profile_picture_url ? (
                        <img
                          src={follower.profile_picture_url}
                          alt={`${follower.username}'s avatar`}
                          className="rounded-circle"
                          width="48"
                          height="48"
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                          style={{ width: "48px", height: "48px" }}
                        >
                          {follower.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/profile/${follower.username}`}
                        className="text-decoration-none fw-bold"
                      >
                        @{follower.username}
                      </Link>
                      {follower.bio && (
                        <p className="text-muted mb-0 small">{follower.bio}</p>
                      )}
                      <small className="text-muted">
                        {follower.followers_count} followers · {follower.following_count} following
                      </small>
                    </div>
                  </div>
                  
                  {currentUser && currentUser.username !== follower.username && (
                    <div>
                      {follower.is_following ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleUnfollow(follower.username)}
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleFollow(follower.username)}
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