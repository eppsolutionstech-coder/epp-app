import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllPurchaseOrders,
	PurchaseOrderWithRelations,
	CreatePurchaseOrder,
	UpdatePurchaseOrder,
} from "~/zod/purchaseOrder.zod";

const { PURCHASE_ORDER } = API_ENDPOINTS;

class PurchaseOrderService extends APIService {
	getAllPurchaseOrders = async () => {
		try {
			const response: ApiResponse<GetAllPurchaseOrders> = await apiClient.get(
				`${PURCHASE_ORDER.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getPurchaseOrderById = async (purchaseOrderId: string) => {
		try {
			const response: ApiResponse<PurchaseOrderWithRelations> = await apiClient.get(
				`${PURCHASE_ORDER.GET_BY_ID.replace(":id", purchaseOrderId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createPurchaseOrder = async (data: CreatePurchaseOrder) => {
		try {
			const response: ApiResponse<{ purchaseOrder: PurchaseOrderWithRelations }> =
				await apiClient.post(PURCHASE_ORDER.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updatePurchaseOrder = async (purchaseOrderId: string, data: UpdatePurchaseOrder) => {
		try {
			const response = await apiClient.patch(
				PURCHASE_ORDER.UPDATE.replace(":id", purchaseOrderId),
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deletePurchaseOrder = async (purchaseOrderId: string) => {
		try {
			const response = await apiClient.delete(
				PURCHASE_ORDER.DELETE.replace(":id", purchaseOrderId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new PurchaseOrderService();
