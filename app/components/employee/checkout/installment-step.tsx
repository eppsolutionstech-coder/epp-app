import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "./checkout-utils";
import type { InstallmentRateTier } from "~/zod/financier-config.zod";

interface InstallmentStepProps {
	total: number;
	selectedInstallments: number;
	onSelectInstallments: (count: number) => void;
	installmentConfigs: InstallmentRateTier[];
	onBack: () => void;
	onNext: () => void;
}

export function InstallmentStep({
	total, // the subtotal basically. Cost of items.
	selectedInstallments,
	onSelectInstallments,
	installmentConfigs,
	onBack,
	onNext,
}: InstallmentStepProps) {
	// Find the configuration for the selected term to calculate the exact total value & per-installment payment
	const selectedTier = installmentConfigs?.find(
		(t) => t.installmentCount === selectedInstallments,
	);
	const activeRate = selectedTier?.rate || 0;
	// Calculate cost relative to interest
	const totalWithInterest = total * (1 + activeRate / 100);
	const perInstallment =
		selectedInstallments > 0 ? totalWithInterest / selectedInstallments : total;

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6 sm:p-8">
				<div className="space-y-6">
					<div>
						<h3 className="font-semibold text-lg mb-2">Choose Your Installment Plan</h3>
						<p className="text-muted-foreground text-sm">
							Select how you'd like to pay through payroll deductions
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{installmentConfigs?.map((tier) => {
							const termTotalWithInterest = total * (1 + tier.rate / 100);
							const payment = termTotalWithInterest / tier.installmentCount;
							const isSelected = selectedInstallments === tier.installmentCount;

							const termLabel =
								tier.installmentCount > 1
									? `${tier.installmentCount} Installments`
									: `${tier.installmentCount} Installment`;

							return (
								<button
									key={tier.installmentCount}
									type="button"
									onClick={() => onSelectInstallments(tier.installmentCount)}
									className={cn(
										"relative p-5 rounded-xl border-2 text-left transition-all duration-200",
										isSelected
											? "border-primary bg-primary/5 shadow-md"
											: "border-border hover:border-primary/50 hover:bg-muted/30",
									)}>
									{isSelected && (
										<div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
											<Check className="h-4 w-4 text-primary-foreground" />
										</div>
									)}
									<div className="font-semibold text-lg">{termLabel}</div>
									<div className="text-2xl font-bold text-primary mt-1">
										{formatPrice(payment)}
										<span className="text-sm font-normal text-muted-foreground">
											/installment
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										{tier.rate > 0
											? `Includes ${tier.rate}% interest`
											: "Interest-free"}
									</p>
								</button>
							);
						})}
					</div>

					{/* Payment Summary */}
					<div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 space-y-3 border border-primary/20">
						<h4 className="font-medium flex items-center gap-2">
							<Clock className="h-4 w-4 text-primary" />
							Payment Summary
						</h4>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">Total Amount</p>
								<p className="font-semibold text-lg">
									{formatPrice(totalWithInterest)}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Installments</p>
								<p className="font-semibold text-lg">
									{selectedInstallments} cutoffs
								</p>
							</div>
						</div>
						<Separator />
						<div className="flex justify-between items-center">
							<span className="font-medium">Per Installment</span>
							<span className="text-2xl font-bold text-primary">
								{formatPrice(perInstallment)}
							</span>
						</div>
					</div>

					<div className="flex justify-between pt-2">
						<Button
							variant="outline"
							onClick={onBack}
							size="lg"
							className="rounded-full">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Button>
						<Button onClick={onNext} size="lg" className="rounded-full px-8">
							Review Order
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
