import { z } from "zod";
import type { ItemWithRelation } from "./item.zod";
import type { Pagination } from "~/types/pagination";

// CartItem Schema (full, including ID)
export const CartItemSchema = z.object({
	id: z.string(),
	userId: z.string(),
	itemId: z.string(),
	quantity: z.number().int().min(1).default(1),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

// Create CartItem Schema (excluding ID, createdAt, updatedAt)
export const CreateCartItemSchema = CartItemSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	quantity: true,
});

export type CreateCartItem = z.infer<typeof CreateCartItemSchema>;

// Update CartItem Schema (partial, excluding immutable fields)
export const UpdateCartItemSchema = CartItemSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;

export interface CartItemWithRelation extends CartItem {
	item: ItemWithRelation;
}

export type GetAllCartItems = {
	cartItems: CartItemWithRelation[];
	pagination: Pagination;
	count: number;
};
