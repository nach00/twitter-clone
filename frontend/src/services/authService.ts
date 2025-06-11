// frontend/src/services/authService.ts
import { apiService } from "./api";
import {
	User,
	AuthUser,
	LoginCredentials,
	RegisterCredentials,
} from "@/types/user";

export class AuthService {
	async login(credentials: LoginCredentials): Promise<AuthUser> {
		const response = await apiService.post<{ user: User; token: string }>(
			"/auth/login",
			credentials,
		);
		if (!response.user) {
			throw new Error('Invalid response: user data missing');
		}
		const authUser: AuthUser = { ...response.user, token: response.token };
		apiService.setAuthToken(response.token);
		return authUser;
	}

	async register(credentials: RegisterCredentials): Promise<AuthUser> {
		const response = await apiService.post<{ user: User; token: string }>(
			"/auth/register",
			{ user: credentials },
		);
		if (!response.user) {
			throw new Error('Invalid response: user data missing');
		}
		const authUser: AuthUser = { ...response.user, token: response.token };
		apiService.setAuthToken(response.token);
		return authUser;
	}

	async logout(): Promise<void> {
		try {
			await apiService.delete("/auth/logout");
		} finally {
			apiService.clearAuth();
		}
	}

	async getCurrentUser(): Promise<User> {
		const response = await apiService.get<{ data: { attributes: User } }>(
			"/auth/me",
		);
		if (!response.data?.attributes) {
			throw new Error('Invalid response: user data missing');
		}
		return response.data.attributes;
	}

	isAuthenticated(): boolean {
		return apiService.isAuthenticated();
	}

	clearAuth(): void {
		apiService.clearAuth();
	}
}

export const authService = new AuthService();
