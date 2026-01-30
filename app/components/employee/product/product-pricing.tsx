import { Badge } from "@/components/ui/badge";

interface ProductPricingProps {
	costPrice: number;
	retailPrice: number;
}

export function ProductPricing({ costPrice, retailPrice }: ProductPricingProps) {
	const savings = retailPrice - costPrice;
	const savingsPercent = Math.round((savings / retailPrice) * 100);

	return (
		<div className="space-y-3">
			<div className="flex items-baseline gap-3">
				<span className="text-3xl font-bold">₱{costPrice.toLocaleString()}</span>
				{savings > 0 && (
					<>
						<span className="text-lg text-muted-foreground line-through">
							₱{retailPrice.toLocaleString()}
						</span>
						<Badge className="bg-red-50 text-red-600 border-0">
							Save {savingsPercent}%
						</Badge>
					</>
				)}
			</div>
			<p className="text-sm text-muted-foreground">
				Employee exclusive price • You save ₱{savings.toLocaleString()}
			</p>
		</div>
	);
}
