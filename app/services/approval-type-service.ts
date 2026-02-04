import { APIService } from "./api-service";
import { apiClient } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";

const { APPROVAL_TYPE } = API_ENDPOINTS;

class ApprovalTypeService extends APIService {
	getAllApprovalTypes = async () => {
		try {
			const response = await apiClient.get(
				`${APPROVAL_TYPE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createApprovalType = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(APPROVAL_TYPE.CREATE, data);
			} else {
				response = await apiClient.post(APPROVAL_TYPE.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateApprovalType = async (id: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.putFormData(
					`${APPROVAL_TYPE.UPDATE.replace(":id", id)}`,
					data,
				);
			} else {
				response = await apiClient.put(`${APPROVAL_TYPE.UPDATE.replace(":id", id)}`, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteApprovalType = async (id: string) => {
		try {
			const response = await apiClient.delete(`${APPROVAL_TYPE.DELETE.replace(":id", id)}`);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ApprovalTypeService();
