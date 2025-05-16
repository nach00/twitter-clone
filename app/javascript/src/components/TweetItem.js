import React from "react";
import { Link } from "react-router-dom";
import { deleteTweetApi } from "../utils/api";

const TweetItem = ({ tweet, currentUser, onDelete }) => {
	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this tweet?")) {
			try {
				await deleteTweetApi(tweet.id);
				onDelete(tweet.id); // Callback to remove from parent's list
			} catch (error) {
				console.error("Failed to delete tweet:", error);
				alert("Failed to delete tweet: " + error.message);
			}
		}
	};

	return (
		<div className="card mb-2">
			<div className="card-body">
				<h6 className="card-subtitle mb-2 text-muted">
					<Link to={`/${tweet.username}`}>@{tweet.username}</Link> -
					<small> {new Date(tweet.created_at).toLocaleString()}</small>
				</h6>
				<p className="card-text">{tweet.content}</p>
				{currentUser && currentUser.id === tweet.user_id && (
					<button
						onClick={handleDelete}
						className="btn btn-sm btn-outline-danger"
					>
						Delete
					</button>
				)}
			</div>
		</div>
	);
};

export default TweetItem;
