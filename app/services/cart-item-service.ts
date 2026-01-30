import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	GetAllCartItems,
	CartItemWithRelation,
	CreateCartItem,
	UpdateCartItem,
} from "~/zod/cartItem.zod";
import type { CreateOrder } from "~/zod/order.zod";

const { CART_ITEM } = API_ENDPOINTS;

class CartItemService extends APIService {
	getAllCartItems = async () => {
		try {
			const response: ApiResponse<GetAllCartItems> = await apiClient.get(
				`${CART_ITEM.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getCartItemById = async (cartItemId: string) => {
		try {
			const response: ApiResponse<CartItemWithRelation> = await apiClient.get(
				`${CART_ITEM.GET_BY_ID.replace(":id", cartItemId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createCartItem = async (data: CreateCartItem) => {
		try {
			const response = await apiClient.post(CART_ITEM.CREATE, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateCartItem = async (cartItemId: string, data: UpdateCartItem) => {
		try {
			const response = await apiClient.patch(
				CART_ITEM.UPDATE.replace(":id", cartItemId),
				data,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteCartItem = async (cartItemId: string) => {
		try {
			const response = await apiClient.delete(CART_ITEM.DELETE.replace(":id", cartItemId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	checkout = async (data: CreateOrder) => {
		try {
			const response = await apiClient.post(CART_ITEM.CHECKOUT, data);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new CartItemService();
