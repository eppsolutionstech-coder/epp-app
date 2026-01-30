import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllCategories, CategoryWithRelation } from "~/zod/category.zod";

const { CATEGORY } = API_ENDPOINTS;

class CategoryService extends APIService {
	getAllCategories = async () => {
		try {
			const response: ApiResponse<GetAllCategories> = await apiClient.get(
				`${CATEGORY.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getCategoryById = async (categoryId: string) => {
		try {
			const response: ApiResponse<CategoryWithRelation> = await apiClient.get(
				`${CATEGORY.GET_BY_ID.replace(":id", categoryId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createCategory = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(CATEGORY.CREATE, data);
			} else {
				response = await apiClient.post(CATEGORY.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateCategory = async (categoryId: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					CATEGORY.UPDATE.replace(":id", categoryId),
					data,
				);
			} else {
				response = await apiClient.patch(CATEGORY.UPDATE.replace(":id", categoryId), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteCategory = async (categoryId: string) => {
		try {
			const response = await apiClient.put(CATEGORY.DELETE.replace(":id", categoryId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new CategoryService();
