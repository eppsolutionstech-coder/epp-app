import { APIService } from "./api-service";
import { ApiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllOrganizations } from "~/zod/organization.zod";

const { ORGANIZATION, AUTH_URL } = API_ENDPOINTS;

const authClient = new ApiClient(AUTH_URL);

class OrganizationService extends APIService {
	getAllOrganizations = async () => {
		try {
			const response: ApiResponse<GetAllOrganizations> = await authClient.get(
				`${ORGANIZATION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrganizationById = async (organizationId: string) => {
		try {
			const response: ApiResponse<any> = await authClient.get(
				`${ORGANIZATION.GET_BY_ID.replace(":id", organizationId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrganization = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await authClient.postFormData(ORGANIZATION.CREATE, data);
			} else {
				response = await authClient.post(ORGANIZATION.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrganization = async (organizationId: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await authClient.patchFormData(
					ORGANIZATION.UPDATE.replace(":id", organizationId),
					data,
				);
			} else {
				response = await authClient.patch(
					ORGANIZATION.UPDATE.replace(":id", organizationId),
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

	deleteOrganization = async (organizationId: string) => {
		try {
			const response = await authClient.put(
				ORGANIZATION.DELETE.replace(":id", organizationId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrganizationService();
