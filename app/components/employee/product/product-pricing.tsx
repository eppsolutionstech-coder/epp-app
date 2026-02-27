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
					<div className="flex items-center gap-2 ml-2">
						<div className="text-muted-foreground flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/20 border border-muted/50">
							<span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
								SRP
							</span>
							<span className="text-md font-medium line-through opacity-80">
								{formatPrice(retailPrice)}
							</span>
						</div>
						<Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border border-green-500/20 transition-colors shadow-sm">
							Save {savingsPercent}%
						</Badge>
					</div>
				)}
			</div>
			<p className="text-sm text-muted-foreground">
				Employee exclusive price • You save {formatPrice(savings)} overall
			</p>
		</div>
	);
}
