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
		<div className="tweet-composer">
			<form onSubmit={handleSubmit}>
				{error && (
					<div style={{
						padding: 'var(--space-md)',
						backgroundColor: '#ff6666',
						color: 'var(--pure-white)',
						borderRadius: 'var(--radius-sharp)',
						marginBottom: 'var(--space-md)',
						fontSize: '0.875rem',
						fontWeight: 'var(--font-weight-bold)',
						textTransform: 'uppercase',
						letterSpacing: '0.05em'
					}}>
						{error}
					</div>
				)}

				<textarea
					className="form-control"
					placeholder="WHAT'S HAPPENING?"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					maxLength={280}
					disabled={isLoading}
					style={{
						minHeight: '120px',
						resize: 'none',
						border: 'none',
						fontSize: '1.1rem'
					}}
				/>

				{image && (
					<div style={{
						display: 'flex',
						alignItems: 'center',
						gap: 'var(--space-md)',
						padding: 'var(--space-md)',
						backgroundColor: 'var(--off-white)',
						borderRadius: 'var(--radius-sharp)',
						marginTop: 'var(--space-md)'
					}}>
						<span className="uppercase weight-black">{image.name}</span>
						<button
							type="button"
							className="btn btn-outline"
							onClick={removeImage}
							style={{ fontSize: '0.75rem' }}
						>
							Remove
						</button>
					</div>
				)}

				<div className="tweet-composer-actions">
					<div>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: 'none' }}
							id="image-upload"
							disabled={isLoading}
						/>
						<label
							htmlFor="image-upload"
							className="btn btn-outline"
							style={{ fontSize: '0.75rem', cursor: 'pointer' }}
						>
							Add Photo
						</label>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
						<span className={`character-count ${remainingChars < 20 ? 'warning' : ''} ${remainingChars < 0 ? 'error' : ''}`}>
							{remainingChars}
						</span>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={!message.trim() || isLoading || remainingChars < 0}
						>
							{isLoading ? "POSTING..." : "POST"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};
