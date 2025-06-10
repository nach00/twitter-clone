// frontend/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TweetCard } from "@/components/TweetCard";
import { Tweet } from "@/types/tweet";
import { User } from "@/types/user";
import { tweetService } from "@/services/tweetService";
import { userService } from "@/services/userService";

export const ProfilePage: React.FC = () => {
	const { username } = useParams<{ username: string }>();
	const { user: currentUser } = useAuth();
	const [profileUser, setProfileUser] = useState<User | null>(null);
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isFollowing, setIsFollowing] = useState(false);
	const [isFollowLoading, setIsFollowLoading] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [bioText, setBioText] = useState("");
	const [bioError, setBioError] = useState("");

	useEffect(() => {
		if (username) {
			loadProfile();
		}
	}, [username]);

	const loadProfile = async () => {
		if (!username) return;

		try {
			setIsLoading(true);
			const [user, userTweets] = await Promise.all([
				userService.getUser(username),
				tweetService.getUserTweets(username),
			]);

			setProfileUser(user);
			setTweets(userTweets);
			setIsFollowing(user.is_following || false);
			setBioText(user.bio || "");
		} catch (err: any) {
			setError("Failed to load profile. Please try again.");
			console.error("Failed to load profile:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFollow = async () => {
		if (!profileUser || !username) return;

		setIsFollowLoading(true);
		try {
			if (isFollowing) {
				await userService.unfollowUser(username);
				setIsFollowing(false);
				setProfileUser({
					...profileUser,
					followers_count: profileUser.followers_count - 1,
				});
			} else {
				await userService.followUser(username);
				setIsFollowing(true);
				setProfileUser({
					...profileUser,
					followers_count: profileUser.followers_count + 1,
				});
			}
		} catch (err) {
			console.error("Failed to toggle follow:", err);
		} finally {
			setIsFollowLoading(false);
		}
	};

	const handleTweetDeleted = (tweetId: number) => {
		setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
		if (profileUser) {
			setProfileUser({
				...profileUser,
				tweets_count: profileUser.tweets_count - 1,
			});
		}
	};

	const handleTweetLiked = (tweetId: number, newLikesCount: number) => {
		setTweets(
			tweets.map((tweet) =>
				tweet.id === tweetId ? { ...tweet, likes_count: newLikesCount } : tweet,
			),
		);
	};

	const handleBioEdit = () => {
		setIsEditingBio(true);
		setBioError("");
	};

	const handleBioCancel = () => {
		setIsEditingBio(false);
		setBioText(profileUser?.bio || "");
		setBioError("");
	};

	const handleBioSave = async () => {
		if (!currentUser) return;

		try {
			setBioError("");
			const updatedUser = await userService.updateProfile({ bio: bioText });
			setProfileUser(updatedUser);
			setIsEditingBio(false);
		} catch (err: any) {
			if (err.response?.data?.errors) {
				setBioError(err.response.data.errors.join(", "));
			} else {
				setBioError("Failed to update bio. Please try again.");
			}
		}
	};

	if (isLoading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error || !profileUser) {
		return (
			<div className="alert alert-danger" role="alert">
				{error || "User not found"}
			</div>
		);
	}

	const isOwnProfile = currentUser?.id === profileUser.id;

	return (
		<div className="py-3">
			{/* Profile Header */}
			<div className="card mb-4">
				<div className="card-body">
					<div className="d-flex align-items-start justify-content-between">
						<div className="d-flex">
							<div className="me-3">
								{profileUser.profile_picture_url ? (
									<img
										src={profileUser.profile_picture_url}
										alt={`${profileUser.username}'s avatar`}
										className="rounded-circle"
										width="80"
										height="80"
									/>
								) : (
									<div
										className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
										style={{ width: "80px", height: "80px", fontSize: "2rem" }}
									>
										{profileUser.username.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<div className="flex-grow-1">
								<h2 className="mb-1">@{profileUser.username}</h2>
								
								{/* Bio Section */}
								{isEditingBio ? (
									<div className="mb-3">
										<textarea
											className="form-control"
											rows={3}
											value={bioText}
											onChange={(e) => setBioText(e.target.value)}
											placeholder="Tell people about yourself..."
											maxLength={160}
										/>
										{bioError && (
											<div className="text-danger small mt-1">{bioError}</div>
										)}
										<div className="text-muted small mt-1">
											{bioText.length}/160 characters
										</div>
										<div className="mt-2">
											<button
												className="btn btn-primary btn-sm me-2"
												onClick={handleBioSave}
											>
												Save
											</button>
											<button
												className="btn btn-outline-secondary btn-sm"
												onClick={handleBioCancel}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div className="mb-2">
										{profileUser.bio ? (
											<p className="text-muted mb-1">{profileUser.bio}</p>
										) : isOwnProfile ? (
											<p className="text-muted fst-italic mb-1">No bio yet</p>
										) : null}
										{isOwnProfile && (
											<button
												className="btn btn-link btn-sm p-0 text-decoration-none"
												onClick={handleBioEdit}
											>
												{profileUser.bio ? "Edit bio" : "Add bio"}
											</button>
										)}
									</div>
								)}
								
								<div className="d-flex gap-3">
									<span>
										<strong>{profileUser.tweets_count}</strong> Tweets
									</span>
									<Link 
										to={`/profile/${profileUser.username}/followers`}
										className="text-decoration-none text-body"
									>
										<strong>{profileUser.followers_count}</strong> Followers
									</Link>
									<Link 
										to={`/profile/${profileUser.username}/following`}
										className="text-decoration-none text-body"
									>
										<strong>{profileUser.following_count}</strong> Following
									</Link>
								</div>
							</div>
						</div>

						{!isOwnProfile && (
							<button
								className={`btn ${
									isFollowing ? "btn-outline-primary" : "btn-primary"
								}`}
								onClick={handleFollow}
								disabled={isFollowLoading}
							>
								{isFollowLoading ? (
									<span className="spinner-border spinner-border-sm me-2" />
								) : null}
								{isFollowing ? "Unfollow" : "Follow"}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Tweets */}
			<div>
				<h4 className="mb-3">Tweets</h4>
				{tweets.length === 0 ? (
					<div className="text-center py-5">
						<h5 className="text-muted">No tweets yet</h5>
						<p className="text-muted">
							{isOwnProfile
								? "Share your first tweet!"
								: `@${profileUser.username} hasn't tweeted yet.`}
						</p>
					</div>
				) : (
					tweets.map((tweet) => (
						<TweetCard
							key={tweet.id}
							tweet={tweet}
							onTweetDeleted={handleTweetDeleted}
							onTweetLiked={handleTweetLiked}
						/>
					))
				)}
			</div>
		</div>
	);
};
