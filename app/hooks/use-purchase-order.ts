import { useMutation, useQuery } from "@tanstack/react-query";
import purchaseOrderService from "~/services/purchase-order-service";
import { queryClient } from "~/lib/query-client";
import type { CreatePurchaseOrder, UpdatePurchaseOrder } from "~/zod/purchaseOrder.zod";

export const useGetPurchaseOrders = (params?: any) => {
	return useQuery({
		queryKey: ["purchase-orders", params],
		queryFn: () => purchaseOrderService.getAllPurchaseOrders(),
	});
};

export const useGetPurchaseOrderById = (id: string) => {
	return useQuery({
		queryKey: ["purchase-order", id],
		queryFn: () => purchaseOrderService.getPurchaseOrderById(id),
		enabled: !!id,
	});
};

export const useCreatePurchaseOrder = () => {
	return useMutation({
		mutationFn: (data: CreatePurchaseOrder) => purchaseOrderService.createPurchaseOrder(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
			queryClient.invalidateQueries({ queryKey: ["order"] }); // Invalidate generic order query if affected
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
