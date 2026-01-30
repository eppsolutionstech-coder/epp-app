import { useMutation, useQuery } from "@tanstack/react-query";
import vendorService from "~/services/vendor-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetVendors = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["vendors", apiParams],
		queryFn: () => {
			return vendorService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllVendors();
		},
	});
};

export const useGetVendorById = (vendorId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["vendor-by-id", vendorId, apiParams],
		queryFn: () => {
			return vendorService.select(apiParams?.fields || "").getVendorById(vendorId);
		},
		enabled: !!vendorId,
	});
};

export const useCreateVendor = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return vendorService.createVendor(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
		},
	});
};

export const useUpdateVendor = () => {
	return useMutation({
		mutationFn: ({ vendorId, data }: { vendorId: string; data: object | FormData }) => {
			return vendorService.updateVendor(vendorId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
		},
	});
};

export const useDeleteVendor = () => {
	return useMutation({
		mutationFn: (vendorId: string) => {
			return vendorService.deleteVendor(vendorId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["vendors"] });
		},
	});
};
