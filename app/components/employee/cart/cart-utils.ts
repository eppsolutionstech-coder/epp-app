import type { CartItemWithRelation } from "~/zod/cartItem.zod";

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

export function getProductImage(item: CartItemWithRelation): string {
	const coverImage = item.item.images?.find((img) => img.type === "COVER");
	return coverImage?.url || item.item.images?.[0]?.url || "/placeholder.png";
}
