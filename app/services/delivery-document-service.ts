import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllDeliveryDocuments,
	DeliveryDocument,
	CreateDeliveryDocument,
	UpdateDeliveryDocument,
	CreateDOToAdminResponse,
	CreateDRFromSupplier,
	CreateDRFromSupplierResponse,
} from "~/zod/deliveryDocument.zod";

const { DELIVERY_DOCUMENT } = API_ENDPOINTS;

class DeliveryDocumentService extends APIService {
	getAllDeliveryDocuments = async () => {
		try {
			const response: ApiResponse<GetAllDeliveryDocuments> = await apiClient.get(
				`${DELIVERY_DOCUMENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getDeliveryDocumentById = async (deliveryDocumentId: string) => {
		try {
			const response: ApiResponse<DeliveryDocument> = await apiClient.get(
				`${DELIVERY_DOCUMENT.GET_BY_ID.replace(":id", deliveryDocumentId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createDeliveryDocument = async (data: CreateDeliveryDocument) => {
		try {
			const response: ApiResponse<{ deliveryDocument: DeliveryDocument }> =
				await apiClient.post(DELIVERY_DOCUMENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createDOToAdmin = async (purchaseOrderId: string) => {
		try {
			const response: ApiResponse<CreateDOToAdminResponse> = await apiClient.post(
				DELIVERY_DOCUMENT.CREATE_DO_TO_ADMIN.replace(":purchaseOrderId", purchaseOrderId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createDRFromSupplier = async ({
		doId,
		data,
	}: {
		doId: string;
		data?: CreateDRFromSupplier;
	}) => {
		try {
			const response: ApiResponse<CreateDRFromSupplierResponse> = await apiClient.post(
				DELIVERY_DOCUMENT.CREATE_DR_FROM_SUPPLIER.replace(":doId", doId),
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateDeliveryDocument = async (deliveryDocumentId: string, data: UpdateDeliveryDocument) => {
		try {
			const response: ApiResponse<{ deliveryDocument: DeliveryDocument }> =
				await apiClient.patch(
					DELIVERY_DOCUMENT.UPDATE.replace(":id", deliveryDocumentId),
					data,
				);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteDeliveryDocument = async (deliveryDocumentId: string) => {
		try {
			const response = await apiClient.delete(
				DELIVERY_DOCUMENT.DELETE.replace(":id", deliveryDocumentId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new DeliveryDocumentService();
