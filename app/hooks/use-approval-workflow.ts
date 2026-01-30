import { useMutation, useQuery } from "@tanstack/react-query";
import approvalWorkflowService from "~/services/approval-workflow-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetApprovalWorkflows = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["approval-workflows", apiParams],
		queryFn: () => {
			return approvalWorkflowService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllApprovalWorkflows();
		},
	});
};

export const useGetApprovalWorkflowById = (id: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["approval-workflow-by-id", id, apiParams],
		queryFn: () => {
			return approvalWorkflowService
				.select(apiParams?.fields || "")
				.getApprovalWorkflowById(id);
		},
		enabled: !!id,
	});
};

export const useCreateApprovalWorkflow = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return approvalWorkflowService.createApprovalWorkflow(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });
		},
	});
};

export const useUpdateApprovalWorkflow = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: object | FormData }) => {
			return approvalWorkflowService.updateApprovalWorkflow(id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });
		},
	});
};

export const useDeleteApprovalWorkflow = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return approvalWorkflowService.deleteApprovalWorkflow(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });
		},
	});
};
