// frontend/src/services/userService.ts
import { apiService } from "./api";
import { User } from "@/types/user";

export class UserService {
	async getUser(username: string): Promise<User> {
		const response = await apiService.get<{ data: { attributes: User } }>(
			`/users/${username}`,
		);
		return response.data.attributes;
	}

	async updateProfile(userData: Partial<User>): Promise<User> {
		const response = await apiService.put<{ data: { attributes: User } }>(
			"/me",
			{ user: userData },
		);
		return response.data.attributes;
	}

	async followUser(username: string): Promise<void> {
		await apiService.post(`/users/${username}/follow`);
	}

	async unfollowUser(username: string): Promise<void> {
		await apiService.delete(`/users/${username}/unfollow`);
	}

	async getFollowers(username: string): Promise<User[]> {
		const response = await apiService.get<{ data: { attributes: User }[] }>(
			`/users/${username}/followers`,
		);
		return response.data.map((item) => item.attributes);
	}

	async getFollowing(username: string): Promise<User[]> {
		const response = await apiService.get<{ data: { attributes: User }[] }>(
			`/users/${username}/following`,
		);
		return response.data.map((item) => item.attributes);
	}

	async searchUsers(keyword: string): Promise<User[]> {
		const response = await apiService.get<{ data: { attributes: User }[] }>(
			`/search/users/${encodeURIComponent(keyword)}`,
		);
		return response.data.map((item) => item.attributes);
	}
}

export const userService = new UserService();
