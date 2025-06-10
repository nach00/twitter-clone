// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
// Removed unused import

class ApiService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: "/api/v1",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Request interceptor to add auth token
		this.api.interceptors.request.use((config) => {
			const token = this.getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// Response interceptor for error handling
		this.api.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					this.removeToken();
					window.location.href = "/login";
				}
				return Promise.reject(error);
			},
		);
	}

	private getToken(): string | null {
		return localStorage.getItem("auth_token");
	}

	private setToken(token: string): void {
		localStorage.setItem("auth_token", token);
	}

	private removeToken(): void {
		localStorage.removeItem("auth_token");
	}

	public setAuthToken(token: string): void {
		this.setToken(token);
	}

	public clearAuth(): void {
		this.removeToken();
	}

	public isAuthenticated(): boolean {
		return !!this.getToken();
	}

	// Generic API methods
	public async get<T>(
		url: string,
		params?: Record<string, unknown>,
	): Promise<T> {
		const response: AxiosResponse<T> = await this.api.get(url, { params });
		return response.data;
	}

	public async post<T>(url: string, data?: unknown): Promise<T> {
		const response: AxiosResponse<T> = await this.api.post(url, data);
		return response.data;
	}

	public async put<T>(url: string, data?: unknown): Promise<T> {
		const response: AxiosResponse<T> = await this.api.put(url, data);
		return response.data;
	}

	public async delete<T>(url: string): Promise<T> {
		const response: AxiosResponse<T> = await this.api.delete(url);
		return response.data;
	}
}

export const apiService = new ApiService();
