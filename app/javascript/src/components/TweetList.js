import React from "react";
import TweetItem from "./TweetItem";

const TweetList = ({ tweets, currentUser, onDeleteTweet }) => {
	if (!tweets || tweets.length === 0) {
		return <p>No tweets yet.</p>;
	}

	return (
		<div>
			{tweets.map((tweet) => (
				<TweetItem
					key={tweet.id}
					tweet={tweet}
					currentUser={currentUser}
					onDelete={onDeleteTweet}
				/>
			))}
		</div>
	);
};

export default TweetList;
