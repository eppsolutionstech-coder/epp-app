import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllVendors, Vendor } from "~/zod/vendor.zod";

const { VENDOR } = API_ENDPOINTS;

class VendorService extends APIService {
	getAllVendors = async () => {
		try {
			const response: ApiResponse<GetAllVendors> = await apiClient.get(
				`${VENDOR.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getVendorById = async (vendorId: string) => {
		try {
			const response: ApiResponse<Vendor> = await apiClient.get(
				`${VENDOR.GET_BY_ID.replace(":id", vendorId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createVendor = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(VENDOR.CREATE, data);
			} else {
				response = await apiClient.post(VENDOR.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateVendor = async (vendorId: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					VENDOR.UPDATE.replace(":id", vendorId),
					data,
				);
			} else {
				response = await apiClient.patch(VENDOR.UPDATE.replace(":id", vendorId), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteVendor = async (vendorId: string) => {
		try {
			const response = await apiClient.put(VENDOR.DELETE.replace(":id", vendorId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new VendorService();
