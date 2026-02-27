import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckoutItem } from "./checkout-utils";
import { formatPrice, getItemImage, calculateInstallmentPricing } from "./checkout-utils";

interface CheckoutItemCardProps {
	item: CheckoutItem;
	compact?: boolean;
	isEppEmployee?: boolean;
}

export function CheckoutItemCard({
	item,
	compact = false,
	isEppEmployee = false,
}: CheckoutItemCardProps) {
	const product = item.item;
	const costPrice = product.employeePrice ?? product.srp;
	const retailPrice = product.srp;
	const hasDiscount = retailPrice > costPrice;
	const savings = retailPrice - costPrice;
	const imageUrl = getItemImage(product);

	const hasInstallment = isEppEmployee && item.installmentCount != null && item.rate != null;
	const installmentPricing = hasInstallment
		? calculateInstallmentPricing(costPrice, item.installmentCount!, item.rate!)
		: null;

	if (compact) {
		return (
			<Card className="overflow-hidden py-0">
				<CardContent className="p-0">
					<div className="flex gap-4 p-4">
						<Link to={`/employee/product/${item.itemId}`} className="shrink-0">
							<div className="h-16 w-16 rounded-lg bg-muted overflow-hidden">
								<img
									src={imageUrl}
									alt={product.name}
									className="h-full w-full object-cover"
								/>
							</div>
						</Link>
						<div className="flex-1 min-w-0 flex items-center justify-between">
							<div className="min-w-0">
								<Link
									to={`/employee/product/${item.itemId}`}
									className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
									{product.name}
								</Link>
								<p className="text-xs text-muted-foreground">
									Qty: {item.quantity}
								</p>
							</div>
							<span className="font-semibold shrink-0">
								{formatPrice(costPrice * item.quantity)}
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
								src={imageUrl}
								alt={product.name}
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
								{product.name}
							</Link>
							<p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
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
													{formatPrice(retailPrice)}
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
