import { useMutation, useQuery } from "@tanstack/react-query";
import orderApprovalService from "~/services/order-approval-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateOrderApproval, UpdateOrderApproval } from "~/zod/order-approval.zod";
import { queryClient } from "~/lib/query-client";

// GET ALL
export const useGetOrderApprovals = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["orderApprovals", apiParams],
		queryFn: () => {
			return orderApprovalService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllOrderApprovals();
		},
	});
};

// GET BY ID
export const useGetOrderApprovalById = (orderApprovalId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["orderApproval-by-id", orderApprovalId, apiParams],
		queryFn: () => {
			return orderApprovalService
				.select(apiParams?.fields || "")
				.getOrderApprovalById(orderApprovalId);
		},
		enabled: !!orderApprovalId,
	});
};

// CREATE
export const useCreateOrderApproval = () => {
	return useMutation({
		mutationFn: (data: CreateOrderApproval) => {
			return orderApprovalService.createOrderApproval(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orderApprovals"] });
		},
	});
};

// UPDATE
export const useUpdateOrderApproval = () => {
	return useMutation({
		mutationFn: ({
			orderApprovalId,
			data,
		}: {
			orderApprovalId: string;
			data: UpdateOrderApproval;
		}) => {
			return orderApprovalService.updateOrderApproval(orderApprovalId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orderApprovals"] });
		},
	});
};

// DELETE
export const useDeleteOrderApproval = () => {
	return useMutation({
		mutationFn: (orderApprovalId: string) => {
			return orderApprovalService.deleteOrderApproval(orderApprovalId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orderApprovals"] });
		},
	});
};
