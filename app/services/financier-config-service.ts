import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllFinancierConfigs,
	FinancierConfigWithRelation,
	CreateFinancierConfig,
	UpdateFinancierConfig,
} from "~/zod/financier-config.zod";

const { FINANCIER_CONFIG } = API_ENDPOINTS;

class FinancierConfigService extends APIService {
	getAllFinancierConfigs = async () => {
		try {
			const response: ApiResponse<GetAllFinancierConfigs> = await apiClient.get(
				`${FINANCIER_CONFIG.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getFinancierConfigById = async (financierConfigId: string) => {
		try {
			const response: ApiResponse<FinancierConfigWithRelation> = await apiClient.get(
				`${FINANCIER_CONFIG.GET_BY_ID.replace(":id", financierConfigId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createFinancierConfig = async (data: CreateFinancierConfig) => {
		try {
			const response: ApiResponse<{ financierConfig: FinancierConfigWithRelation }> =
				await apiClient.post(FINANCIER_CONFIG.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateFinancierConfig = async (financierConfigId: string, data: UpdateFinancierConfig) => {
		try {
			const response = await apiClient.patch(
				FINANCIER_CONFIG.UPDATE.replace(":id", financierConfigId),
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteFinancierConfig = async (financierConfigId: string) => {
		try {
			const response = await apiClient.delete(
				FINANCIER_CONFIG.DELETE.replace(":id", financierConfigId),
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new FinancierConfigService();
