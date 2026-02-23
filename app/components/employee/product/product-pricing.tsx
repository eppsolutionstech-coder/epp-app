import { Badge } from "@/components/ui/badge";
import { formatPrice } from "../checkout/checkout-utils";
import { useGetFinancierConfigs } from "~/hooks/use-financier-config";

interface ProductPricingProps {
	costPrice: number;
	retailPrice: number;
	selectedInstallment: number;
}

export function ProductPricing({
	costPrice,
	retailPrice,
	selectedInstallment,
}: ProductPricingProps) {
	const { data: configsData } = useGetFinancierConfigs();
	const firstConfig = configsData?.financierConfigs?.[0];
	const installmentRateConfig = firstConfig?.installmentRateConfig || [];

	const selectedTier = installmentRateConfig.find(
		(tier) => tier.installmentCount === selectedInstallment,
	);

	const rate = selectedTier?.rate || 0;
	const totalWithInterest = costPrice * (1 + rate / 100);
	const payment = selectedInstallment > 0 ? totalWithInterest / selectedInstallment : costPrice;

	const savings = retailPrice - totalWithInterest;
	const savingsPercent = Math.round((savings / retailPrice) * 100);

	return (
		<div className="space-y-3">
			<div className="flex items-baseline gap-3">
				<span className="text-3xl font-bold">{formatPrice(payment)}</span>
				{selectedInstallment > 0 && (
					<span className="text-base text-muted-foreground -ml-1">/installment</span>
				)}
				{savings > 0 && (
					<>
						<span className="text-lg text-muted-foreground line-through ml-2">
							{formatPrice(retailPrice)}
						</span>
						<Badge className="bg-red-50 text-red-600 border-0">
							Save {savingsPercent}%
						</Badge>
					</>
				)}
			</div>
			<p className="text-sm text-muted-foreground">
				Employee exclusive price • You save {formatPrice(savings)} overall
			</p>
		</div>
	);
}
