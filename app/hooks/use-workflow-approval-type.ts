import { useMutation, useQuery } from "@tanstack/react-query";
import workflowApprovalTypeService from "~/services/workflow-approval-type-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetWorkflowApprovalTypes = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["workflow-approval-types", apiParams],
		queryFn: () => {
			return workflowApprovalTypeService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllWorkflowApprovalTypes();
		},
	});
};

export const useGetWorkflowApprovalTypeById = (id: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["workflow-approval-type-by-id", id, apiParams],
		queryFn: () => {
			return workflowApprovalTypeService
				.select(apiParams?.fields || "")
				.getWorkflowApprovalTypeById(id);
		},
		enabled: !!id,
	});
};

export const useCreateWorkflowApprovalType = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return workflowApprovalTypeService.createWorkflowApprovalType(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-types"] });
		},
	});
};

export const useUpdateWorkflowApprovalType = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: object | FormData }) => {
			return workflowApprovalTypeService.updateWorkflowApprovalType(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-types"] });
		},
	});
};

export const useDeleteWorkflowApprovalType = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return workflowApprovalTypeService.deleteWorkflowApprovalType(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflow-approval-types"] });
		},
	});
};
