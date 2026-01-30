import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { ApprovalWorkflow, GetAllApprovalWorkflows } from "~/zod/approval-workflow.zod";

const { APPROVAL_WORKFLOW } = API_ENDPOINTS;

class ApprovalWorkflowService extends APIService {
	getAllApprovalWorkflows = async () => {
		try {
			const response: ApiResponse<GetAllApprovalWorkflows> = await apiClient.get(
				`${APPROVAL_WORKFLOW.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getApprovalWorkflowById = async (id: string) => {
		try {
			const response: ApiResponse<ApprovalWorkflow> = await apiClient.get(
				`${APPROVAL_WORKFLOW.GET_BY_ID.replace(":id", id)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createApprovalWorkflow = async (data: object | FormData) => {
		try {
			let response: ApiResponse<ApprovalWorkflow>;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(APPROVAL_WORKFLOW.CREATE, data);
			} else {
				response = await apiClient.post(APPROVAL_WORKFLOW.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateApprovalWorkflow = async (id: string, data: object | FormData) => {
		try {
			let response: ApiResponse<ApprovalWorkflow>;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					APPROVAL_WORKFLOW.UPDATE.replace(":id", id),
					data,
				);
			} else {
				response = await apiClient.patch(APPROVAL_WORKFLOW.UPDATE.replace(":id", id), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteApprovalWorkflow = async (id: string) => {
		try {
			const response = await apiClient.put(APPROVAL_WORKFLOW.DELETE.replace(":id", id));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ApprovalWorkflowService();
