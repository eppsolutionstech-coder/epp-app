import type React from "react";
import type { ItemWithRelation } from "~/zod/item.zod";

// Type for checkout items received from cart or direct buy
// Compatible with CartItemWithRelation but allows optional id (for direct buy)
export interface CheckoutItem {
	id?: string; // Cart Item ID
	itemId: string; // Product ID
	quantity: number;
	item: ItemWithRelation;
}

export type CheckoutStep = "summary" | "installment" | "confirmation" | "success";

export interface StepConfig {
	id: CheckoutStep;
	label: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

export interface InstallmentOption {
	count: number;
	label: string;
	description: string;
}

export const installmentOptions: InstallmentOption[] = [
	{ count: 3, label: "3 Installments", description: "Higher per cutoff, pay faster" },
	{ count: 6, label: "6 Installments", description: "Balanced option" },
	{ count: 12, label: "12 Installments", description: "Lower per cutoff payments" },
	{ count: 24, label: "24 Installments", description: "Lowest per cutoff payments" },
];

export const formatPrice = (price: number): string => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
};

export const getItemImage = (item: ItemWithRelation) => {
	const coverImage = item.images?.find((img) => img.type === "COVER");
	return coverImage?.url || item.images?.[0]?.url || "/placeholder.png";
};

export const calculateTotals = (items: CheckoutItem[]) => {
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const costTotal = items.reduce(
		(sum, item) => sum + (item.item.costPrice ?? 0) * item.quantity,
		0,
	);
	const retailTotal = items.reduce((sum, item) => sum + item.item.retailPrice * item.quantity, 0);

	// Subtotal is Retail Price Sum
	const subtotal = retailTotal;
	const totalSavings = retailTotal - costTotal;
	// Total to pay is Cost Price Sum
	const total = costTotal;

	return { totalItems, subtotal, totalSavings, total };
};
