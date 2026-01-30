import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import type { CheckoutItem } from "./checkout-utils";
import { formatPrice, calculateTotals } from "./checkout-utils";
import { CheckoutItemCard } from "./checkout-item-card";

interface SummaryStepProps {
	items: CheckoutItem[];
	onNext: () => void;
}

export function SummaryStep({ items, onNext }: SummaryStepProps) {
	const { totalItems, subtotal, totalSavings, total } = calculateTotals(items);

	return (
		<>
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-lg">Order Items</h3>
				<Badge variant="secondary">
					{totalItems} {totalItems === 1 ? "item" : "items"}
				</Badge>
			</div>

			{/* Product Cards */}
			<div className="space-y-4">
				{items.map((item) => (
					<CheckoutItemCard key={item.itemId} item={item} />
				))}
			</div>

			{/* Order Summary Card */}
			<Card className="py-0">
				<CardContent className="p-6">
					<h2 className="font-semibold text-lg mb-4">Order Summary</h2>
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
								You're saving {formatPrice(totalSavings)} with employee discount!
							</p>
						)}
					</div>

					<Button
						onClick={onNext}
						className="w-full mt-6 rounded-full h-12 text-base"
						size="lg">
						Continue to Payment
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</CardContent>
			</Card>
		</>
	);
}
