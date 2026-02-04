import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllWorkflowApprovalTypes,
	WorkflowApprovalTypeWithRelation,
} from "~/zod/workflow-approval-type.zod";

const { WORKFLOW_APPROVAL_TYPE } = API_ENDPOINTS;

class WorkflowApprovalTypeService extends APIService {
	getAllWorkflowApprovalTypes = async () => {
		try {
			const response: ApiResponse<GetAllWorkflowApprovalTypes> = await apiClient.get(
				`${WORKFLOW_APPROVAL_TYPE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getWorkflowApprovalTypeById = async (id: string) => {
		try {
			const response: ApiResponse<WorkflowApprovalTypeWithRelation> = await apiClient.get(
				`${WORKFLOW_APPROVAL_TYPE.GET_BY_ID.replace(":id", id)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createWorkflowApprovalType = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(WORKFLOW_APPROVAL_TYPE.CREATE, data);
			} else {
				response = await apiClient.post(WORKFLOW_APPROVAL_TYPE.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateWorkflowApprovalType = async (id: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					WORKFLOW_APPROVAL_TYPE.UPDATE.replace(":id", id),
					data,
				);
			} else {
				response = await apiClient.patch(
					WORKFLOW_APPROVAL_TYPE.UPDATE.replace(":id", id),
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

	deleteWorkflowApprovalType = async (id: string) => {
		try {
			const response = await apiClient.put(WORKFLOW_APPROVAL_TYPE.DELETE.replace(":id", id));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new WorkflowApprovalTypeService();
