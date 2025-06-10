// frontend/src/types/user.ts
export interface User {
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
}

export interface AuthUser extends User {
	token: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	username: string;
	email: string;
	password: string;
	password_confirmation: string;
}
