import { Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemWithRelation } from "~/zod/cartItem.zod";
import { formatPrice, getProductImage } from "./cart-utils";
import { calculateInstallmentPricing } from "../checkout/checkout-utils";

interface CartItemCardProps {
	item: CartItemWithRelation;
	isSelected: boolean;
	onSelectChange: (checked: boolean) => void;
	onQuantityChange: (newQuantity: number) => void;
	onRemove: () => void;
	isUpdating: boolean;
	isDeleting: boolean;
	isEppEmployee?: boolean;
}

export function CartItemCard({
	item,
	isSelected,
	onSelectChange,
	onQuantityChange,
	onRemove,
	isUpdating,
	isDeleting,
	isEppEmployee = false,
}: CartItemCardProps) {
	const [localQuantity, setLocalQuantity] = useState(item.quantity);
	const costPrice = item.item.costPrice ?? item.item.retailPrice;
	const hasDiscount = item.item.retailPrice > costPrice;
	const savings = item.item.retailPrice - costPrice;

	const hasInstallment =
		isEppEmployee &&
		item.installmentCount != null &&
		item.rate != null;
	const installmentPricing = hasInstallment
		? calculateInstallmentPricing(costPrice, item.installmentCount!, item.rate!)
		: null;

	// Prepare debounced update
	useEffect(() => {
		const timer = setTimeout(() => {
			if (localQuantity !== item.quantity) {
				onQuantityChange(localQuantity);
			}
		}, 600);

		return () => clearTimeout(timer);
	}, [localQuantity, item.quantity, onQuantityChange]);

	// Sync local state when prop changes (e.g. from external updates)
	useEffect(() => {
		setLocalQuantity(item.quantity);
	}, [item.quantity]);

	const handleIncrement = () => {
		if (localQuantity >= item.item.stockQuantity) return;
		setLocalQuantity((prev) => prev + 1);
		if (!isSelected) {
			onSelectChange(true);
		}
	};

	const handleDecrement = () => {
		if (localQuantity <= 1) return;
		setLocalQuantity((prev) => prev - 1);
		if (!isSelected) {
			onSelectChange(true);
		}
	};

	return (
		<Card
			className={`overflow-hidden transition-all py-2 ${isSelected ? "ring-2 ring-primary/20" : ""}`}>
			<CardContent className="p-0">
				<div className="flex gap-4 p-4">
					{/* Selection Checkbox */}
					<div className="flex items-center">
						<Checkbox
							id={`select-${item.id}`}
							checked={isSelected}
							onCheckedChange={(checked) => onSelectChange(!!checked)}
							className="h-5 w-5"
						/>
					</div>

					{/* Product Image */}
					<Link to={`/employee/product/${item.item.id}`} className="shrink-0">
						<div className="h-28 w-28 rounded-xl bg-muted overflow-hidden">
							<img
								src={getProductImage(item)}
								alt={item.item.name}
								className="h-full w-full object-cover transition-transform hover:scale-105"
							/>
						</div>
					</Link>

					{/* Product Details */}
					<div className="flex-1 min-w-0 flex flex-col">
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0">
								<Link
									to={`/employee/product/${item.item.id}`}
									className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
									{item.item.name}
								</Link>
								<p className="text-xs text-muted-foreground">
									{item.item.supplier.name}
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
								onClick={onRemove}
								disabled={isDeleting}>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>

						<div className="mt-auto pt-3 flex items-end justify-between">
							{/* Price */}
							<div>
								{installmentPricing ? (
									<>
										<div className="flex items-baseline gap-2">
											<span className="text-lg font-semibold">
												{formatPrice(installmentPricing.perInstallment)}
											</span>
											<span className="text-sm text-muted-foreground">
												/ installment
											</span>
										</div>
										<p className="text-xs text-muted-foreground">
											{item.installmentCount}x · Total{" "}
											{formatPrice(installmentPricing.totalWithInterest)}
										</p>
									</>
								) : (
									<>
										<div className="flex items-baseline gap-2">
											<span className="text-lg font-semibold">
												{formatPrice(costPrice)}
											</span>
											{hasDiscount && (
												<span className="text-sm text-muted-foreground line-through">
													{formatPrice(item.item.retailPrice)}
												</span>
											)}
										</div>
										{hasDiscount && (
											<p className="text-xs text-green-600 font-medium">
												You save {formatPrice(savings)}
											</p>
										)}
									</>
								)}
							</div>

							{/* Quantity Controls */}
							<div className="flex items-center gap-1 bg-muted rounded-full p-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={handleDecrement}
									disabled={localQuantity <= 1 || isUpdating}>
									<Minus className="h-4 w-4" />
								</Button>
								<span className="w-8 text-center font-medium text-sm">
									{localQuantity}
								</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full"
									onClick={handleIncrement}
									disabled={
										localQuantity >= item.item.stockQuantity || isUpdating
									}>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

