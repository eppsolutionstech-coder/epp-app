import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "./cart-utils";
import { calculateTotals } from "../checkout/checkout-utils";
import type { CheckoutItem } from "../checkout/checkout-utils";
import type { CartItemWithRelation } from "~/zod/cartItem.zod";

interface OrderSummaryProps {
	selectedItems: Set<string>;
	cartItems: CartItemWithRelation[];
}

export function OrderSummary({ selectedItems, cartItems }: OrderSummaryProps) {
	const navigate = useNavigate();
	const hasSelectedItems = selectedItems.size > 0;

	const { totalItems, subtotal, totalSavings, total } = calculateTotals(cartItems);

	const handleCheckout = () => {
		navigate("/employee/checkout", {
			state: { items: cartItems, source: "cart" },
		});
	};

	return (
		<div className="lg:col-span-1 pt-9">
			<Card className="sticky top-0 py-0">
				<CardContent className="p-6">
					<h2 className="font-semibold text-lg mb-4">Order Summary</h2>

					{!hasSelectedItems ? (
						<p className="text-sm text-muted-foreground text-center py-4">
							Select items to see the summary
						</p>
					) : (
						<div className="space-y-3 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
								</span>
								<span>{formatPrice(subtotal)}</span>
							</div>

							{totalSavings > 0 && (
								<div className="flex justify-between text-green-600">
									<span>Employee Discount</span>
									<span>-{formatPrice(totalSavings)}</span>
								</div>
							)}

							<Separator />

							<div className="flex justify-between text-base font-semibold">
								<span>Total</span>
								<span>{formatPrice(total)}</span>
							</div>

							{totalSavings > 0 && (
								<p className="text-xs text-muted-foreground text-center pt-1">
									You're saving {formatPrice(totalSavings)} with employee pricing!
								</p>
							)}
						</div>
					)}

					<Button
						className="w-full mt-6 rounded-full h-12 text-base"
						size="lg"
						disabled={!hasSelectedItems}
						onClick={handleCheckout}>
						{hasSelectedItems
							? `Proceed to Checkout (${selectedItems.size})`
							: "Select Items to Checkout"}
					</Button>

					<Button variant="ghost" className="w-full mt-2 text-muted-foreground" asChild>
						<Link to="/employee/catalog">Continue Shopping</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
