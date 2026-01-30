import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllWorkflowApprovalLevels, WorkflowApprovalLevelWithRelation } from "~/zod/workflowApprovalLevel.zod";

const { WORKFLOW_APPROVAL_LEVEL } = API_ENDPOINTS;

class WorkflowApprovalLevelService extends APIService {
	getAllWorkflowApprovalLevels = async () => {
		try {
			const response: ApiResponse<GetAllWorkflowApprovalLevels> = await apiClient.get(
				`${WORKFLOW_APPROVAL_LEVEL.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getWorkflowApprovalLevelById = async (id: string) => {
		try {
			const response: ApiResponse<WorkflowApprovalLevelWithRelation> = await apiClient.get(
				`${WORKFLOW_APPROVAL_LEVEL.GET_BY_ID.replace(":id", id)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createWorkflowApprovalLevel = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(WORKFLOW_APPROVAL_LEVEL.CREATE, data);
			} else {
				response = await apiClient.post(WORKFLOW_APPROVAL_LEVEL.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateWorkflowApprovalLevel = async (id: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					WORKFLOW_APPROVAL_LEVEL.UPDATE.replace(":id", id),
					data,
				);
			} else {
				response = await apiClient.patch(
					WORKFLOW_APPROVAL_LEVEL.UPDATE.replace(":id", id),
					data,
				);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteWorkflowApprovalLevel = async (id: string) => {
		try {
			const response = await apiClient.put(WORKFLOW_APPROVAL_LEVEL.DELETE.replace(":id", id));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new WorkflowApprovalLevelService();
