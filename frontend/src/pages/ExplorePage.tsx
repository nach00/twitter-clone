// frontend/src/pages/ExplorePage.tsx
import React, { useState, useEffect } from "react";
import { TweetCard } from "@/components/TweetCard";
import { Tweet } from "@/types/tweet";
import { tweetService } from "@/services/tweetService";

export const ExplorePage: React.FC = () => {
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Tweet[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		loadAllTweets();
	}, []);

	const loadAllTweets = async () => {
		try {
			setIsLoading(true);
			const allTweets = await tweetService.getAllTweets();
			setTweets(allTweets);
		} catch (err: any) {
			setError("Failed to load tweets. Please try again.");
			console.error("Failed to load tweets:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const results = await tweetService.searchTweets(searchQuery);
			setSearchResults(results);
		} catch (err) {
			console.error("Search failed:", err);
		} finally {
			setIsSearching(false);
		}
	};

	const handleTweetDeleted = (tweetId: number) => {
		setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
		setSearchResults(searchResults.filter((tweet) => tweet.id !== tweetId));
	};

	const handleTweetLiked = (tweetId: number, newLikesCount: number) => {
		const updateTweet = (tweetList: Tweet[]) =>
			tweetList.map((tweet) =>
				tweet.id === tweetId ? { ...tweet, likes_count: newLikesCount } : tweet,
			);

		setTweets(updateTweet);
		setSearchResults(updateTweet);
	};

	const displayTweets = searchQuery.trim() ? searchResults : tweets;

	if (isLoading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="py-3">
			<div className="mb-4">
				<h2 className="mb-3">Explore</h2>

				{/* Search */}
				<form onSubmit={handleSearch} className="mb-3">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							placeholder="Search tweets..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							className="btn btn-outline-secondary"
							type="submit"
							disabled={isSearching}
						>
							{isSearching ? (
								<span className="spinner-border spinner-border-sm" />
							) : (
								"Search"
							)}
						</button>
					</div>
				</form>

				{searchQuery.trim() && (
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h5>Search results for "{searchQuery}"</h5>
						<button
							className="btn btn-sm btn-outline-secondary"
							onClick={() => {
								setSearchQuery("");
								setSearchResults([]);
							}}
						>
							Clear
						</button>
					</div>
				)}
			</div>

			{error && (
				<div className="alert alert-danger" role="alert">
					{error}
				</div>
			)}

			<div>
				{displayTweets.length === 0 ? (
					<div className="text-center py-5">
						<h4 className="text-muted">
							{searchQuery.trim() ? "No tweets found" : "No tweets yet"}
						</h4>
						<p className="text-muted">
							{searchQuery.trim()
								? "Try a different search term"
								: "Be the first to tweet!"}
						</p>
					</div>
				) : (
					displayTweets.map((tweet) => (
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
