// frontend/src/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { TweetComposer } from "@/components/TweetComposer";
import { TweetCard } from "@/components/TweetCard";
import { Tweet } from "@/types/tweet";
import { tweetService } from "@/services/tweetService";

export const HomePage: React.FC = () => {
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		loadFeed();
	}, []);

	const loadFeed = async () => {
		try {
			setIsLoading(true);
			// Load user's personalized feed (own tweets + followed users' tweets)
			const feedTweets = await tweetService.getFeed();
			setTweets(feedTweets);
		} catch (err: any) {
			setError("Failed to load your feed. Please try again.");
			console.error("Failed to load feed:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTweetCreated = (newTweet: Tweet) => {
		setTweets([newTweet, ...tweets]);
	};

	const handleTweetDeleted = (tweetId: number) => {
		setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
	};

	const handleTweetLiked = (tweetId: number, newLikesCount: number) => {
		setTweets(
			tweets.map((tweet) =>
				tweet.id === tweetId ? { ...tweet, likes_count: newLikesCount } : tweet,
			),
		);
	};

	if (isLoading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-2">Loading your feed...</p>
			</div>
		);
	}

	return (
		<div className="py-3">
			<div className="mb-4">
				<h2 className="mb-3">Home</h2>
				<TweetComposer onTweetCreated={handleTweetCreated} />
			</div>

			{error && (
				<div className="alert alert-danger" role="alert">
					{error}
					<button
						className="btn btn-sm btn-outline-danger ms-2"
						onClick={loadFeed}
					>
						Retry
					</button>
				</div>
			)}

			<div>
				{tweets.length === 0 ? (
					<div className="text-center py-5">
						<h4 className="text-muted">Your feed is empty</h4>
						<p className="text-muted">
							Follow some users to see their tweets here, or create your first tweet!
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
