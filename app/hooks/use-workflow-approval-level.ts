import { useMutation, useQuery } from "@tanstack/react-query";
import workflowApprovalLevelService from "~/services/workflow-approval-level-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetWorkflowApprovalLevels = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["workflow-approval-levels", apiParams],
		queryFn: () => {
			return workflowApprovalLevelService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllWorkflowApprovalLevels();
		},
	});
};

export const useGetWorkflowApprovalLevelById = (id: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["workflow-approval-level-by-id", id, apiParams],
		queryFn: () => {
			return workflowApprovalLevelService
				.select(apiParams?.fields || "")
				.getWorkflowApprovalLevelById(id);
		},
		enabled: !!id,
	});
};

export const useCreateWorkflowApprovalLevel = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return workflowApprovalLevelService.createWorkflowApprovalLevel(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-levels"] });
		},
	});
};

export const useUpdateWorkflowApprovalLevel = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: object | FormData }) => {
			return workflowApprovalLevelService.updateWorkflowApprovalLevel(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-levels"] });
		},
	});
};

export const useDeleteWorkflowApprovalLevel = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return workflowApprovalLevelService.deleteWorkflowApprovalLevel(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-levels"] });
		},
	});
};
