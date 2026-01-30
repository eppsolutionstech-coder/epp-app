import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckoutItem } from "./checkout-utils";
import { formatPrice } from "./checkout-utils";

interface CheckoutItemCardProps {
	item: CheckoutItem;
	compact?: boolean;
}

export function CheckoutItemCard({ item, compact = false }: CheckoutItemCardProps) {
	const hasDiscount = item.retailPrice > item.costPrice;
	const savings = item.retailPrice - item.costPrice;

	if (compact) {
		return (
			<Card className="overflow-hidden py-0">
				<CardContent className="p-0">
					<div className="flex gap-4 p-4">
						<Link to={`/employee/product/${item.itemId}`} className="shrink-0">
							<div className="h-16 w-16 rounded-lg bg-muted overflow-hidden">
								<img
									src={item.productImage}
									alt={item.productName}
									className="h-full w-full object-cover"
								/>
							</div>
						</Link>
						<div className="flex-1 min-w-0 flex items-center justify-between">
							<div className="min-w-0">
								<Link
									to={`/employee/product/${item.itemId}`}
									className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
									{item.productName}
								</Link>
								<p className="text-xs text-muted-foreground">
									Qty: {item.quantity}
								</p>
							</div>
							<span className="font-semibold shrink-0">
								{formatPrice(item.costPrice * item.quantity)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden py-2">
			<CardContent className="p-0">
				<div className="flex gap-4 p-4">
					{/* Product Image */}
					<Link to={`/employee/product/${item.itemId}`} className="shrink-0">
						<div className="h-28 w-28 rounded-xl bg-muted overflow-hidden">
							<img
								src={item.productImage}
								alt={item.productName}
								className="h-full w-full object-cover transition-transform hover:scale-105"
							/>
						</div>
					</Link>

					{/* Product Details */}
					<div className="flex-1 min-w-0 flex flex-col">
						<div className="min-w-0">
							<Link
								to={`/employee/product/${item.itemId}`}
								className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
								{item.productName}
							</Link>
							<p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
						</div>

						<div className="mt-auto pt-3 flex items-end justify-between">
							{/* Price */}
							<div>
								<div className="flex items-baseline gap-2">
									<span className="text-lg font-semibold">
										{formatPrice(item.costPrice)}
									</span>
									{hasDiscount && (
										<span className="text-sm text-muted-foreground line-through">
											{formatPrice(item.retailPrice)}
										</span>
									)}
								</div>
								{hasDiscount && (
									<p className="text-xs text-green-600 font-medium">
										You save {formatPrice(savings)}
									</p>
								)}
							</div>

							{/* Quantity Display */}
							<div className="flex items-center gap-1 bg-muted rounded-full px-4 py-2">
								<span className="text-sm font-medium">Qty: {item.quantity}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
