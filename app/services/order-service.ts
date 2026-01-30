import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllOrders, OrderWithRelation, CreateOrder, UpdateOrder } from "~/zod/order.zod";

const { ORDER } = API_ENDPOINTS;

class OrderService extends APIService {
	getAllOrders = async () => {
		try {
			const response: ApiResponse<GetAllOrders> = await apiClient.get(
				`${ORDER.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrderById = async (orderId: string) => {
		try {
			const response: ApiResponse<OrderWithRelation> = await apiClient.get(
				`${ORDER.GET_BY_ID.replace(":id", orderId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrder = async (data: CreateOrder) => {
		try {
			const response: ApiResponse<{ order: OrderWithRelation }> = await apiClient.post(
				ORDER.CREATE,
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrder = async (orderId: string, data: UpdateOrder) => {
		try {
			const response = await apiClient.patch(ORDER.UPDATE.replace(":id", orderId), data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrder = async (orderId: string) => {
		try {
			const response = await apiClient.delete(ORDER.DELETE.replace(":id", orderId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrderService();
