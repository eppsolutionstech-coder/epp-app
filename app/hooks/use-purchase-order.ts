import { useMutation, useQuery } from "@tanstack/react-query";
import purchaseOrderService from "~/services/purchase-order-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreatePurchaseOrder, UpdatePurchaseOrder } from "~/zod/purchaseOrder.zod";
import { queryClient } from "~/lib/query-client";

export const useGetPurchaseOrders = (
	apiParams?: ApiQueryParams,
	options?: { enabled?: boolean },
) => {
	return useQuery({
		queryKey: ["purchaseOrders", apiParams],
		queryFn: () => {
			return purchaseOrderService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllPurchaseOrders();
		},
		enabled: options?.enabled,
	});
};

export const useGetPurchaseOrderById = (purchaseOrderId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["purchaseOrder-by-id", purchaseOrderId, apiParams],
		queryFn: () => {
			return purchaseOrderService
				.select(apiParams?.fields || "")
				.getPurchaseOrderById(purchaseOrderId);
		},
		enabled: !!purchaseOrderId,
	});
};

export const useCreatePurchaseOrder = () => {
	return useMutation({
		mutationFn: (data: CreatePurchaseOrder) => {
			return purchaseOrderService.createPurchaseOrder(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
		},
	});
};

export const useUpdatePurchaseOrder = () => {
	return useMutation({
		mutationFn: ({
			purchaseOrderId,
			data,
		}: {
			purchaseOrderId: string;
			data: UpdatePurchaseOrder;
		}) => {
			return purchaseOrderService.updatePurchaseOrder(purchaseOrderId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
		},
	});
};

export const useDeletePurchaseOrder = () => {
	return useMutation({
		mutationFn: (purchaseOrderId: string) => {
			return purchaseOrderService.deletePurchaseOrder(purchaseOrderId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
		},
	});
};
