import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllInstallments,
	InstallmentWithRelation,
	CreateInstallment,
	UpdateInstallment,
	InstallmentLedger,
	InstallmentOrderSummary,
	PayInstallmentPayload,
} from "~/zod/installment.zod";

const { INSTALLMENT } = API_ENDPOINTS;

class InstallmentService extends APIService {
	getAllInstallments = async () => {
		try {
			const response: ApiResponse<GetAllInstallments> = await apiClient.get(
				`${INSTALLMENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getInstallmentById = async (installmentId: string) => {
		try {
			const response: ApiResponse<InstallmentWithRelation> = await apiClient.get(
				`${INSTALLMENT.GET_BY_ID.replace(":id", installmentId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getInstallmentLedger = async ({
		employeeId,
		orderId,
	}: {
		employeeId: string;
		orderId: string;
	}) => {
		try {
			const response: ApiResponse<InstallmentLedger> = await apiClient.get(
				INSTALLMENT.GET_LEDGER.replace(":employeeId", employeeId).replace(":orderId", orderId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getInstallmentSummaryByOrder = async (orderId: string) => {
		try {
			const response: ApiResponse<InstallmentOrderSummary> = await apiClient.get(
				INSTALLMENT.GET_SUMMARY_ORDER.replace(":orderId", orderId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createInstallment = async (data: CreateInstallment | FormData) => {
		try {
			const response: ApiResponse<InstallmentWithRelation> =
				data instanceof FormData
					? await apiClient.postFormData(INSTALLMENT.CREATE, data)
					: await apiClient.post(INSTALLMENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateInstallment = async ({
		installmentId,
		data,
	}: {
		installmentId: string;
		data: UpdateInstallment | FormData;
	}) => {
		try {
			const response: ApiResponse<{ installment: InstallmentWithRelation }> =
				data instanceof FormData
					? await apiClient.patchFormData(
							INSTALLMENT.UPDATE.replace(":id", installmentId),
							data,
						)
					: await apiClient.patch(INSTALLMENT.UPDATE.replace(":id", installmentId), data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteInstallment = async (installmentId: string) => {
		try {
			const response = await apiClient.delete(
				INSTALLMENT.DELETE.replace(":id", installmentId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	payInstallment = async ({
		installmentId,
		data,
	}: {
		installmentId: string;
		data: PayInstallmentPayload;
	}) => {
		try {
			const response: ApiResponse<{ installment: InstallmentWithRelation }> =
				await apiClient.post(INSTALLMENT.PAY_INSTALLMENT.replace(":id", installmentId), data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new InstallmentService();
