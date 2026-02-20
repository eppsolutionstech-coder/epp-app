import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllFinancierDisbursements,
	FinancierDisbursementWithRelation,
	CreateFinancierDisbursement,
	UpdateFinancierDisbursement,
	ReconcileFinancierDisbursement,
	CreateFinancierDisbursementRemittance,
	FinancierDisbursementRemittanceCreateResponse,
	FinancierDisbursementRemittancesResponse,
	FinancierDisbursementSoa,
} from "~/zod/financier-disbursement.zod";

const { FINANCIER_DISBURSEMENT } = API_ENDPOINTS;
export type LedgerRole = "financier" | "admin";

class FinancierDisbursementService extends APIService {
	getAllFinancierDisbursements = async () => {
		try {
			const response: ApiResponse<
				GetAllFinancierDisbursements | FinancierDisbursementWithRelation[]
			> = await apiClient.get(`${FINANCIER_DISBURSEMENT.GET_ALL}${this.getQueryString()}`);

			if (Array.isArray(response.data)) {
				return { financierDisbursements: response.data } as GetAllFinancierDisbursements;
			}

			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getFinancierDisbursementById = async (financierDisbursementId: string) => {
		try {
			const response: ApiResponse<FinancierDisbursementWithRelation> = await apiClient.get(
				`${FINANCIER_DISBURSEMENT.GET_BY_ID.replace(":id", financierDisbursementId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createFinancierDisbursement = async (data: CreateFinancierDisbursement | FormData) => {
		try {
			const response: ApiResponse<FinancierDisbursementWithRelation> =
				data instanceof FormData
					? await apiClient.postFormData(FINANCIER_DISBURSEMENT.CREATE, data)
					: await apiClient.post(FINANCIER_DISBURSEMENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateFinancierDisbursement = async ({
		financierDisbursementId,
		data,
	}: {
		financierDisbursementId: string;
		data: UpdateFinancierDisbursement | FormData;
	}) => {
		try {
			const response: ApiResponse<FinancierDisbursementWithRelation> =
				data instanceof FormData
					? await apiClient.patchFormData(
							FINANCIER_DISBURSEMENT.UPDATE.replace(":id", financierDisbursementId),
							data,
						)
					: await apiClient.patch(
							FINANCIER_DISBURSEMENT.UPDATE.replace(":id", financierDisbursementId),
							data,
						);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteFinancierDisbursement = async (financierDisbursementId: string) => {
		try {
			const response = await apiClient.delete(
				FINANCIER_DISBURSEMENT.DELETE.replace(":id", financierDisbursementId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getLedger = async (
		financierConfigId: string,
		role: LedgerRole = "financier",
	) => {
		try {
			const response: ApiResponse<FinancierDisbursementSoa> = await apiClient.get(
				FINANCIER_DISBURSEMENT.GET_LEDGER.replace(":role", role).replace(
					":financierConfigId",
					financierConfigId,
				),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	// reconcileFinancierDisbursement = async ({
	// 	financierDisbursementId,
	// 	data,
	// }: {
	// 	financierDisbursementId: string;
	// 	data: ReconcileFinancierDisbursement;
	// }) => {
	// 	try {
	// 		const response: ApiResponse<FinancierDisbursementWithRelation> = await apiClient.post(
	// 			FINANCIER_DISBURSEMENT.RECONCILE.replace(":id", financierDisbursementId),
	// 			data,
	// 		);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };

	// createFinancierDisbursementRemittance = async ({
	// 	financierDisbursementId,
	// 	data,
	// }: {
	// 	financierDisbursementId: string;
	// 	data: CreateFinancierDisbursementRemittance;
	// }) => {
	// 	try {
	// 		const response: ApiResponse<FinancierDisbursementRemittanceCreateResponse> =
	// 			await apiClient.post(
	// 				FINANCIER_DISBURSEMENT.CREATE_REMITTANCE.replace(
	// 					":id",
	// 					financierDisbursementId,
	// 				),
	// 				data,
	// 			);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };

	// getFinancierDisbursementRemittances = async (financierDisbursementId: string) => {
	// 	try {
	// 		const response: ApiResponse<FinancierDisbursementRemittancesResponse> =
	// 			await apiClient.get(
	// 				FINANCIER_DISBURSEMENT.GET_REMITTANCES.replace(":id", financierDisbursementId),
	// 			);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };

	// getFinancierDisbursementLedger = async (financierConfigId: string) => {
	// 	try {
	// 		const response: ApiResponse<FinancierDisbursementLedger> = await apiClient.get(
	// 			FINANCIER_DISBURSEMENT.GET_LEDGER.replace(":financierConfigId", financierConfigId),
	// 		);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };

	// getAdminToFinancierSoa = async (financierConfigId?: string) => {
	// 	try {
	// 		const endpoint = financierConfigId
	// 			? FINANCIER_DISBURSEMENT.GET_ADMIN_SOA_BY_ID.replace(
	// 					":financierConfigId",
	// 					financierConfigId,
	// 				)
	// 			: FINANCIER_DISBURSEMENT.GET_ADMIN_SOA;

	// 		const response: ApiResponse<FinancierDisbursementSoa> = await apiClient.get(endpoint);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };

	// getFinancierSoa = async (financierConfigId: string) => {
	// 	try {
	// 		const response: ApiResponse<FinancierDisbursementSoa> = await apiClient.get(
	// 			FINANCIER_DISBURSEMENT.GET_FINANCIER_SOA.replace(
	// 				":financierConfigId",
	// 				financierConfigId,
	// 			),
	// 		);
	// 		return response.data;
	// 	} catch (error: any) {
	// 		throw new Error(
	// 			error.data?.errors?.[0]?.message || error.message || "An error has occurred",
	// 		);
	// 	}
	// };
}

export default new FinancierDisbursementService();
