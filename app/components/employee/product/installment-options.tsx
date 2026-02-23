import { CreditCard, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "../checkout/checkout-utils";
import { useGetFinancierConfigs } from "~/hooks/use-financier-config";

interface InstallmentOptionsProps {
	costPrice: number;
	selectedInstallment: number;
	onSelectInstallment: (count: number) => void;
}

export function InstallmentOptions({
	costPrice,
	selectedInstallment,
	onSelectInstallment,
}: InstallmentOptionsProps) {
	const { data: configsData, isLoading } = useGetFinancierConfigs();

	const firstConfig = configsData?.financierConfigs?.[0];
	const installmentRateConfig = firstConfig?.installmentRateConfig || [];

	if (isLoading) {
		return (
			<div className="space-y-3">
				<h3 className="font-medium">Payment Options</h3>
				<div className="flex items-center justify-center p-8 text-muted-foreground">
					<Loader2 className="h-6 w-6 animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<h3 className="font-medium">Payment Options</h3>
			<div className="grid grid-cols-2 gap-3">
				{installmentRateConfig.map((tier) => {
					const totalWithInterest = costPrice * (1 + tier.rate / 100);
					const payment = totalWithInterest / tier.installmentCount;

					const isSelected = selectedInstallment === tier.installmentCount;
					return (
						<button
							key={tier.installmentCount}
							type="button"
							onClick={() => onSelectInstallment(tier.installmentCount)}
							className={cn(
								"relative p-4 rounded-xl border-2 text-left transition-all duration-200",
								isSelected
									? "border-primary bg-primary/5 shadow-md"
									: "border-border hover:border-primary/50 hover:bg-muted/30",
							)}>
							{isSelected && (
								<div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
									<Check className="h-3 w-3 text-primary-foreground" />
								</div>
							)}
							<div className="font-semibold text-sm">
								{tier.installmentCount}{" "}
								{tier.installmentCount > 1 ? "Installments" : "Installment"}
							</div>
							<div className="text-lg font-bold text-primary mt-1">
								{formatPrice(payment)}
								<span className="text-xs font-normal text-muted-foreground">
									/installment
								</span>
							</div>
						</button>
					);
				})}
			</div>
			<p className="text-xs text-muted-foreground flex items-center gap-1">
				<CreditCard className="h-3 w-3" />
				{installmentRateConfig.some((t) => t.rate > 0)
					? "Installments via salary deduction"
					: "Interest-free installments via salary deduction"}
			</p>
		</div>
	);
}
