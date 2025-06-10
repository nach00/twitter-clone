// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials, RegisterCredentials } from "@/types/user";
import { authService } from "@/services/authService";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			if (authService.isAuthenticated()) {
				try {
					const currentUser = await authService.getCurrentUser();
					setUser(currentUser);
				} catch (error) {
					console.error("Failed to get current user:", error);
					authService.clearAuth();
				}
			}
			setIsLoading(false);
		};

		initializeAuth();
	}, []);

	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true);
		try {
			const authUser = await authService.login(credentials);
			setUser(authUser);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (credentials: RegisterCredentials) => {
		setIsLoading(true);
		try {
			const authUser = await authService.register(credentials);
			setUser(authUser);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await authService.logout();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
