import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TweetList from "../components/TweetList";
import { fetchUserTweets } from "../utils/api";

const UserPage = ({ currentUser }) => {
	const [userTweets, setUserTweets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { username } = useParams(); // Gets username from URL

	useEffect(() => {
		const loadUserTweets = async () => {
			try {
				setError("");
				setLoading(true);
				const fetchedTweets = await fetchUserTweets(username);
				setUserTweets(fetchedTweets);
			} catch (err) {
				setError(err.message || `Failed to fetch tweets for ${username}.`);
			} finally {
				setLoading(false);
			}
		};
		if (username) {
			loadUserTweets();
		}
	}, [username]);

	const handleDeleteTweet = (deletedTweetId) => {
		setUserTweets((prevTweets) =>
			prevTweets.filter((tweet) => tweet.id !== deletedTweetId),
		);
	};

	if (loading) return <p>Loading tweets for @{username}...</p>;
	if (error) return <p className="text-danger">Error: {error}</p>;

	return (
		<div>
			<h3>@{username}'s Tweets</h3>
			<TweetList
				tweets={userTweets}
				currentUser={currentUser}
				onDeleteTweet={handleDeleteTweet}
			/>
		</div>
	);
};

export default UserPage;
