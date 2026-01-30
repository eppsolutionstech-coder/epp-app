import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllItems, ItemWithRelation } from "~/zod/item.zod";

const { ITEM } = API_ENDPOINTS;

class ItemService extends APIService {
	getAllItems = async () => {
		try {
			const response: ApiResponse<GetAllItems> = await apiClient.get(
				`${ITEM.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getItemById = async (itemId: string) => {
		try {
			const response: ApiResponse<ItemWithRelation> = await apiClient.get(
				`${ITEM.GET_BY_ID.replace(":id", itemId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createItem = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(ITEM.CREATE, data);
			} else {
				response = await apiClient.post(ITEM.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateItem = async (itemId: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(ITEM.UPDATE.replace(":id", itemId), data);
			} else {
				response = await apiClient.patch(ITEM.UPDATE.replace(":id", itemId), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteItem = async (itemId: string) => {
		try {
			const response = await apiClient.put(ITEM.DELETE.replace(":id", itemId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ItemService();
