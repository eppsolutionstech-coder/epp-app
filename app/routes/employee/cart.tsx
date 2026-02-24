import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCartItems, useUpdateCartItem, useDeleteCartItem } from "~/hooks/use-cart-item";
import {
	CartLoading,
	CartError,
	CartEmpty,
	CartHeader,
	CartItemCard,
	OrderSummary,
} from "~/components/employee/cart";
import { useAuth } from "~/hooks/use-auth";

export default function EmployeeCart() {
	const {
		data: cartItemsResponse,
		isLoading,
		isError,
	} = useGetCartItems({
		fields: "id, userId, installmentCount, rate, itemId, item.id, item.sku, item.name, item.retailPrice, item.costPrice, item.stockQuantity, item.images, quantity, item.supplier.name, createdAt, updatedAt",
		limit: 50,
	});
	const updateCartItem = useUpdateCartItem();
	const deleteCartItem = useDeleteCartItem();
	const { user } = useAuth();
	const isEppEmployee = (user?.role as string) === "epp-employee";

	// Extract the cartItems array from the response
	const cartItems = cartItemsResponse?.cartItems ?? [];

	// Selected items state
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

	// Check if all items are selected
	const allSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;
	const someSelected = selectedItems.size > 0 && selectedItems.size < cartItems.length;

	// Handle select all toggle
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedItems(new Set(cartItems.map((item) => item.id)));
		} else {
			setSelectedItems(new Set());
		}
	};

	// Handle individual item selection
	const handleSelectItem = (itemId: string, checked: boolean) => {
		const newSelected = new Set(selectedItems);
		if (checked) {
			newSelected.add(itemId);
		} else {
			newSelected.delete(itemId);
		}
		setSelectedItems(newSelected);
	};

	// Filter selected cart items for calculations
	const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id));

	const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

	const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		updateCartItem.mutate({
			cartItemId,
			data: { quantity: newQuantity },
		});
	};

	const handleRemoveItem = (cartItemId: string) => {
		deleteCartItem.mutate(cartItemId);
	};

	if (isLoading) {
		return <CartLoading />;
	}

	if (isError) {
		return <CartError />;
	}

	if (cartItems.length === 0) {
		return <CartEmpty />;
	}

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<CartHeader totalItemCount={totalItemCount} />

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-4">
					{/* Select All */}
					<div className="flex items-center gap-3 px-1">
						<Checkbox
							id="select-all"
							checked={allSelected}
							ref={(el) => {
								if (el) {
									(
										el as HTMLButtonElement & { indeterminate: boolean }
									).indeterminate = someSelected;
								}
							}}
							onCheckedChange={(checked) => handleSelectAll(!!checked)}
							className="h-5 w-5"
						/>
						<label
							htmlFor="select-all"
							className="text-sm font-medium cursor-pointer select-none">
							Select All ({cartItems.length}{" "}
							{cartItems.length === 1 ? "item" : "items"})
						</label>
					</div>

					{cartItems.map((item) => (
						<CartItemCard
							key={item.id}
							item={item}
							isSelected={selectedItems.has(item.id)}
							onSelectChange={(checked) => handleSelectItem(item.id, checked)}
							onQuantityChange={(newQuantity) =>
								handleQuantityChange(item.id, newQuantity)
							}
							onRemove={() => handleRemoveItem(item.id)}
							isUpdating={updateCartItem.isPending}
							isDeleting={deleteCartItem.isPending}
							isEppEmployee={isEppEmployee}
						/>
					))}
				</div>

				{/* Order Summary */}
				<OrderSummary selectedItems={selectedItems} cartItems={selectedCartItems} />
			</div>
		</div>
	);
}
