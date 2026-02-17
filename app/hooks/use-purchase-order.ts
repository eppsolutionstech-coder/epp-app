import { useMutation, useQuery } from "@tanstack/react-query";
import purchaseOrderService from "~/services/purchase-order-service";
import { queryClient } from "~/lib/query-client";
import type { CreatePurchaseOrder, UpdatePurchaseOrder } from "~/zod/purchaseOrder.zod";

import type { ApiQueryParams } from "~/services/api-service";

export const useGetPurchaseOrders = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["purchase-orders", apiParams],
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
	});
};

export const useGetPurchaseOrderById = (id: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["purchase-order", id, apiParams],
		queryFn: () => {
			return purchaseOrderService.select(apiParams?.fields || "").getPurchaseOrderById(id);
		},
		enabled: !!id,
	});
};

export const useCreatePurchaseOrder = () => {
	return useMutation({
		mutationFn: (data: CreatePurchaseOrder) => purchaseOrderService.createPurchaseOrder(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
			queryClient.invalidateQueries({ queryKey: ["order"] }); // Invalidate generic order query if affected
			queryClient.invalidateQueries({ queryKey: ["order-by-id"] }); // Invalidate generic order query if affected
		},
	});
};

export const useUpdatePurchaseOrder = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseOrder }) =>
			purchaseOrderService.updatePurchaseOrder(id, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
			queryClient.invalidateQueries({ queryKey: ["purchase-order", variables.id] });
		},
	});
};

export const useDeletePurchaseOrder = () => {
	return useMutation({
		mutationFn: (id: string) => purchaseOrderService.deletePurchaseOrder(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
		},
	});
};
