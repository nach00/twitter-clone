// frontend/src/types/tweet.ts
export interface Tweet {
	id: number;
	message: string;
	likes_count: number;
	created_at: string;
	updated_at: string;
	image_url?: string;
	is_liked_by_current_user: boolean;
	time_ago: string;
	user: {
		id: number;
		username: string;
		email: string;
		bio?: string;
		profile_picture_url?: string;
		tweets_count: number;
		followers_count: number;
		following_count: number;
		created_at: string;
		is_following?: boolean;
		is_followed_by?: boolean;
	};
}

export interface CreateTweetData {
	message: string;
	image?: File;
}
