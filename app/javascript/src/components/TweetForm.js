import React, { useState } from "react";
import { createTweet } from "../utils/api";

const TweetForm = ({ currentUser, onTweetPosted }) => {
	const [content, setContent] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) {
			setError("Tweet cannot be empty.");
			return;
		}
		setError("");
		try {
			const newTweet = await createTweet({ content });
			onTweetPosted(newTweet); // Callback to update parent's tweet list
			setContent("");
		} catch (err) {
			setError(err.message || "Failed to post tweet.");
		}
	};

	if (!currentUser) {
		return null; // Don't show form if not logged in
	}

	return (
		<div className="card mb-3">
			<div className="card-body">
				<h5 className="card-title">What's happening?</h5>
				{error && <div className="alert alert-danger">{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<textarea
							className="form-control"
							rows="3"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Compose new tweet..."
							maxLength="280"
						></textarea>
						<small className="form-text text-muted">
							{280 - content.length} characters remaining
						</small>
					</div>
					<button type="submit" className="btn btn-primary">
						Tweet
					</button>
				</form>
			</div>
		</div>
	);
};

export default TweetForm;
