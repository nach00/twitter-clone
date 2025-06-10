// frontend/src/services/tweetService.ts
import { apiService } from "./api";
import { Tweet, CreateTweetData } from "@/types/tweet";

export class TweetService {
	async getFeed(page = 1, perPage = 20): Promise<Tweet[]> {
		const response = await apiService.get<{ data: { attributes: Tweet }[] }>(
			"/feed",
			{ page, per_page: perPage },
		);
		return response.data.map((item) => item.attributes);
	}

	async getAllTweets(page = 1, perPage = 20): Promise<Tweet[]> {
		const response = await apiService.get<{ data: { attributes: Tweet }[] }>(
			"/tweets",
			{ page, per_page: perPage },
		);
		return response.data.map((item) => item.attributes);
	}

	async getUserTweets(
		username: string,
		page = 1,
		perPage = 20,
	): Promise<Tweet[]> {
		const response = await apiService.get<{ data: { attributes: Tweet }[] }>(
			`/users/${username}/tweets`,
			{ page, per_page: perPage },
		);
		return response.data.map((item) => item.attributes);
	}

	async createTweet(tweetData: CreateTweetData): Promise<Tweet> {
		const formData = new FormData();
		formData.append("tweet[message]", tweetData.message);
		if (tweetData.image) {
			formData.append("tweet[image]", tweetData.image);
		}

		const response = await apiService.post<{ data: { attributes: Tweet } }>(
			"/tweets",
			formData,
		);
		return response.data.attributes;
	}

	async deleteTweet(tweetId: number): Promise<void> {
		await apiService.delete(`/tweets/${tweetId}`);
	}

	async likeTweet(tweetId: number): Promise<{ likes_count: number }> {
		const response = await apiService.post<{ likes_count: number }>(
			`/tweets/${tweetId}/like`,
		);
		return response;
	}

	async unlikeTweet(tweetId: number): Promise<{ likes_count: number }> {
		const response = await apiService.delete<{ likes_count: number }>(
			`/tweets/${tweetId}/unlike`,
		);
		return response;
	}

	async searchTweets(keyword: string): Promise<Tweet[]> {
		const response = await apiService.get<{ data: { attributes: Tweet }[] }>(
			`/search/tweets/${encodeURIComponent(keyword)}`,
		);
		return response.data.map((item) => item.attributes);
	}
}

export const tweetService = new TweetService();
