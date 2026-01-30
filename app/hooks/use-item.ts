import { useMutation, useQuery } from "@tanstack/react-query";
import itemService from "~/services/item-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetItems = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["items", apiParams],
		queryFn: () => {
			return itemService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllItems();
		},
	});
};

export const useGetItemById = (itemId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["item-by-id", itemId, apiParams],
		queryFn: () => {
			return itemService.select(apiParams?.fields || "").getItemById(itemId);
		},
		enabled: !!itemId,
	});
};

export const useCreateItem = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return itemService.createItem(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};

export const useUpdateItem = () => {
	return useMutation({
		mutationFn: ({ itemId, data }: { itemId: string; data: object | FormData }) => {
			return itemService.updateItem(itemId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};

export const useDeleteItem = () => {
	return useMutation({
		mutationFn: (itemId: string) => {
			return itemService.deleteItem(itemId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});
};
