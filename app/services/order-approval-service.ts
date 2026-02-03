import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllOrderApprovals,
	OrderApprovalWithRelation,
	CreateOrderApproval,
	UpdateOrderApproval,
} from "~/zod/order-approval.zod";

const { ORDER_APPROVAL } = API_ENDPOINTS;

class OrderApprovalService extends APIService {
	getAllOrderApprovals = async () => {
		try {
			const response: ApiResponse<GetAllOrderApprovals> = await apiClient.get(
				`${ORDER_APPROVAL.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrderApprovalById = async (orderApprovalId: string) => {
		try {
			const response: ApiResponse<OrderApprovalWithRelation> = await apiClient.get(
				`${ORDER_APPROVAL.GET_BY_ID.replace(":id", orderApprovalId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrderApproval = async (data: CreateOrderApproval) => {
		try {
			const response: ApiResponse<{ orderApproval: OrderApprovalWithRelation }> =
				await apiClient.post(ORDER_APPROVAL.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrderApproval = async (orderApprovalId: string, data: UpdateOrderApproval) => {
		try {
			const response = await apiClient.patch(
				ORDER_APPROVAL.UPDATE.replace(":id", orderApprovalId),
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrderApproval = async (orderApprovalId: string) => {
		try {
			const response = await apiClient.delete(
				ORDER_APPROVAL.DELETE.replace(":id", orderApprovalId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrderApprovalService();
