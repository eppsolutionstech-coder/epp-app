import { useMutation, useQuery } from "@tanstack/react-query";
import approvalLevelService from "~/services/approval-level-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetApprovalLevels = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["approval-levels", apiParams],
		queryFn: () => {
			return approvalLevelService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllApprovalLevels();
		},
	});
};

export const useCreateApprovalLevel = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return approvalLevelService.createApprovalLevel(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-levels"] });
		},
	});
};

export const useUpdateApprovalLevel = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: object | FormData }) => {
			return approvalLevelService.updateApprovalLevel(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-levels"] });
		},
	});
};

export const useDeleteApprovalLevel = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return approvalLevelService.deleteApprovalLevel(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-levels"] });
		},
	});
};
