import { API_ENDPOINTS } from "~/configs/endpoints";
import { ApiClient, apiClient, type ApiResponse } from "~/lib/api-client";
import type { loginResponse } from "~/types/auth";

const { AUTH, AUTH_URL } = API_ENDPOINTS;

const authClient = new ApiClient(AUTH_URL);

class AuthService {
	login = async (body: any) => {
		try {
			const response: ApiResponse<loginResponse> = await authClient.post(AUTH.LOGIN, body);
			return response.data;
		} catch (error: any) {
			console.error("Error logging in:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "Error logging in",
			);
		}
	};

	logout = async () => {
		try {
			const response = await authClient.post(AUTH.LOGOUT);
			return response.data;
		} catch (error: any) {
			console.error("Error logging out:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "Error logging out",
			);
		}
	};

	register = async (body: any) => {
		try {
			const response = await authClient.post(AUTH.REGISTER, body);
			return response.data;
		} catch (error: any) {
			console.error("Error registering:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "Error registering",
			);
		}
	};
}

const authService = new AuthService();

export default authService;
