import React, { useState, useEffect } from "react";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { fetchTweets } from "../utils/api";

const HomePage = ({ currentUser }) => {
	const [tweets, setTweets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadTweets = async () => {
			try {
				setError("");
				setLoading(true);
				const fetchedTweets = await fetchTweets();
				setTweets(fetchedTweets);
			} catch (err) {
				setError(err.message || "Failed to fetch tweets.");
			} finally {
				setLoading(false);
			}
		};
		loadTweets();
	}, []);

	const handleTweetPosted = (newTweet) => {
		setTweets((prevTweets) => [newTweet, ...prevTweets]);
	};

	const handleDeleteTweet = (deletedTweetId) => {
		setTweets((prevTweets) =>
			prevTweets.filter((tweet) => tweet.id !== deletedTweetId),
		);
	};

	if (loading) return <p>Loading tweets...</p>;
	if (error) return <p className="text-danger">Error: {error}</p>;

	return (
		<div>
			{currentUser && (
				<TweetForm
					currentUser={currentUser}
					onTweetPosted={handleTweetPosted}
				/>
			)}
			<TweetList
				tweets={tweets}
				currentUser={currentUser}
				onDeleteTweet={handleDeleteTweet}
			/>
		</div>
	);
};

export default HomePage;
