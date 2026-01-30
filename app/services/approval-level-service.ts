import { APIService } from "./api-service";
import { apiClient } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";

const { APPROVAL_LEVEL } = API_ENDPOINTS;

class ApprovalLevelService extends APIService {
	getAllApprovalLevels = async () => {
		try {
			const response = await apiClient.get(
				`${APPROVAL_LEVEL.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createApprovalLevel = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(APPROVAL_LEVEL.CREATE, data);
			} else {
				response = await apiClient.post(APPROVAL_LEVEL.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateApprovalLevel = async (id: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.putFormData(
					`${APPROVAL_LEVEL.UPDATE.replace(":id", id)}`,
					data,
				);
			} else {
				response = await apiClient.put(`${APPROVAL_LEVEL.UPDATE.replace(":id", id)}`, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteApprovalLevel = async (id: string) => {
		try {
			const response = await apiClient.delete(`${APPROVAL_LEVEL.DELETE.replace(":id", id)}`);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ApprovalLevelService();
