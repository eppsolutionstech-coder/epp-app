import { useMutation, useQuery } from "@tanstack/react-query";
import orderService from "~/services/order-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateOrder, UpdateOrder } from "~/zod/order.zod";
import { queryClient } from "~/lib/query-client";

export const useGetOrders = (apiParams?: ApiQueryParams, options?: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ["orders", apiParams],
		queryFn: () => {
			return orderService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllOrders();
		},
		enabled: options?.enabled,
	});
};

export const useGetOrderById = (orderId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["order-by-id", orderId, apiParams],
		queryFn: () => {
			return orderService.select(apiParams?.fields || "").getOrderById(orderId);
		},
		enabled: !!orderId,
	});
};

export const useCreateOrder = () => {
	return useMutation({
		mutationFn: (data: CreateOrder) => {
			return orderService.createOrder(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};

export const useUpdateOrder = () => {
	return useMutation({
		mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrder }) => {
			return orderService.updateOrder(orderId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};

export const useDeleteOrder = () => {
	return useMutation({
		mutationFn: (orderId: string) => {
			return orderService.deleteOrder(orderId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};
