// frontend/src/components/TweetComposer.tsx
import React, { useState } from "react";
import { tweetService } from "@/services/tweetService";
import { Tweet } from "@/types/tweet";

interface TweetComposerProps {
	onTweetCreated: (tweet: Tweet) => void;
}

export const TweetComposer: React.FC<TweetComposerProps> = ({
	onTweetCreated,
}) => {
	const [message, setMessage] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		setIsLoading(true);
		setError("");

		try {
			const newTweet = await tweetService.createTweet({
				message: message.trim(),
				image: image || undefined,
			});
			onTweetCreated(newTweet);
			setMessage("");
			setImage(null);
		} catch (err: any) {
			setError(
				err.response?.data?.errors?.join(", ") ||
					"Failed to create tweet. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
		}
	};

	const removeImage = () => {
		setImage(null);
	};

	const remainingChars = 280 - message.length;

	return (
		<div className="card">
			<div className="card-body">
				<form onSubmit={handleSubmit}>
					{error && (
						<div className="alert alert-danger alert-sm mb-3">{error}</div>
					)}

					<div className="mb-3">
						<textarea
							className="form-control"
							rows={3}
							placeholder="What's happening?"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							maxLength={280}
							disabled={isLoading}
						/>
						<div className="d-flex justify-content-between align-items-center mt-2">
							<small
								className={`text-${remainingChars < 20 ? "danger" : "muted"}`}
							>
								{remainingChars} characters remaining
							</small>
						</div>
					</div>

					{image && (
						<div className="mb-3">
							<div className="d-flex align-items-center">
								<span className="me-2">📎 {image.name}</span>
								<button
									type="button"
									className="btn btn-sm btn-outline-danger"
									onClick={removeImage}
								>
									Remove
								</button>
							</div>
						</div>
					)}

					<div className="d-flex justify-content-between align-items-center">
						<div>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="d-none"
								id="image-upload"
								disabled={isLoading}
							/>
							<label
								htmlFor="image-upload"
								className="btn btn-outline-secondary btn-sm"
							>
								📷 Add Photo
							</label>
						</div>

						<button
							type="submit"
							className="btn btn-primary"
							disabled={!message.trim() || isLoading || remainingChars < 0}
						>
							{isLoading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" />
									Posting...
								</>
							) : (
								"Tweet"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
