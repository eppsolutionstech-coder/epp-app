import { useMutation, useQuery } from "@tanstack/react-query";
import cartItemService from "~/services/cart-item-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateCartItem, UpdateCartItem } from "~/zod/cartItem.zod";
import type { CreateOrder } from "~/zod/order.zod";
import { queryClient } from "~/lib/query-client";

export const useGetCartItems = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["cart-items", apiParams],
		queryFn: () => {
			return cartItemService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllCartItems();
		},
	});
};

export const useGetCartItemById = (cartItemId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["cart-item-by-id", cartItemId, apiParams],
		queryFn: () => {
			return cartItemService.select(apiParams?.fields || "").getCartItemById(cartItemId);
		},
		enabled: !!cartItemId,
	});
};

export const useCreateCartItem = () => {
	return useMutation({
		mutationFn: (data: CreateCartItem) => {
			return cartItemService.createCartItem(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart-items"] });
		},
	});
};

export const useUpdateCartItem = () => {
	return useMutation({
		mutationFn: ({ cartItemId, data }: { cartItemId: string; data: UpdateCartItem }) => {
			return cartItemService.updateCartItem(cartItemId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart-items"] });
		},
	});
};

export const useDeleteCartItem = () => {
	return useMutation({
		mutationFn: (cartItemId: string) => {
			return cartItemService.deleteCartItem(cartItemId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart-items"] });
		},
	});
};

export const useCheckoutCart = () => {
	return useMutation({
		mutationFn: (data: CreateOrder) => {
			return cartItemService.checkout(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart-items"] });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
};
