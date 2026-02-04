import { useMutation, useQuery } from "@tanstack/react-query";
import approvalTypeService from "~/services/approval-type-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetApprovalTypes = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["approval-types", apiParams],
		queryFn: () => {
			return approvalTypeService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllApprovalTypes();
		},
	});
};

export const useCreateApprovalType = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return approvalTypeService.createApprovalType(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-types"] });
		},
	});
};

export const useUpdateApprovalType = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: object | FormData }) => {
			return approvalTypeService.updateApprovalType(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-types"] });
		},
	});
};

export const useDeleteApprovalType = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return approvalTypeService.deleteApprovalType(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-types"] });
		},
	});
};
