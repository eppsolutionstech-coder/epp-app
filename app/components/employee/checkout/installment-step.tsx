import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, installmentOptions } from "./checkout-utils";

interface InstallmentStepProps {
	total: number;
	selectedInstallments: number;
	onSelectInstallments: (count: number) => void;
	onBack: () => void;
	onNext: () => void;
}

export function InstallmentStep({
	total,
	selectedInstallments,
	onSelectInstallments,
	onBack,
	onNext,
}: InstallmentStepProps) {
	const perInstallment = total / selectedInstallments;

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
						{installmentOptions.map((option) => {
							const payment = total / option.count;
							const isSelected = selectedInstallments === option.count;
							return (
								<button
									key={option.count}
									type="button"
									onClick={() => onSelectInstallments(option.count)}
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
									<div className="font-semibold text-lg">{option.label}</div>
									<div className="text-2xl font-bold text-primary mt-1">
										{formatPrice(payment)}
										<span className="text-sm font-normal text-muted-foreground">
											/installment
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										{option.description}
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
								<p className="font-semibold text-lg">{formatPrice(total)}</p>
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
