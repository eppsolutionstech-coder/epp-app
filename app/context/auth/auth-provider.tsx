import { useState, useEffect, type ReactNode } from "react";
import AuthContext, { type AuthContextType } from "./auth-context";
import authService from "~/services/auth-service";
import userService from "~/services/user-service";
import { queryClient } from "~/lib/query-client";
import type { UserWithRelation } from "~/zod/user.zod";
import { useNavigate } from "react-router";

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserWithRelation | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const appCode = "CAA";

	// Clear error function
	const clearError = () => setError(null);

	// Get current user from API
	const getCurrentUser = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await userService.getCurrentUser();

			setUser(response as any);
		} catch (error: any) {
			console.error("Error fetching current user:", error);
			setUser(null);
			navigate("/login");
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await authService.login({ email, password, appCode });

			setUser(response as any);

			return response;
		} catch (error: any) {
			console.error("Login error:", error);
			setError(error.message || "Login failed. Please try again.");
			throw error; // Re-throw so the login form can handle it
		} finally {
			setIsLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Call the logout API
			await authService.logout();

			// Clear user state
			setUser(null);

			// Invalidate all queries to clear cached data
			await queryClient.invalidateQueries();

			// Clear all cached data
			queryClient.clear();

			// Components can handle navigation after logout
		} catch (error: any) {
			console.error("Logout error:", error);
			setError(error.message || "Logout failed");
			// Still clear user state even if API call fails
			setUser(null);
			// Still clear queries even if API call fails
			await queryClient.invalidateQueries();
			queryClient.clear();
		} finally {
			setIsLoading(false);
		}
	};

	// Check for existing authentication on mount
	useEffect(() => {
		getCurrentUser();
	}, []);

	const contextValue: AuthContextType = {
		user,
		isLoading,
		error,
		login,
		logout,
		getCurrentUser,
		clearError,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
