import { CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { installmentOptions, formatPrice } from "../checkout/checkout-utils";

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
	return (
		<div className="space-y-3">
			<h3 className="font-medium">Payment Options</h3>
			<div className="grid grid-cols-2 gap-3">
				{installmentOptions.map((option) => {
					const payment = costPrice / option.count;
					const isSelected = selectedInstallment === option.count;
					return (
						<button
							key={option.count}
							type="button"
							onClick={() => onSelectInstallment(option.count)}
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
							<div className="font-semibold text-sm">{option.label}</div>
							<div className="text-lg font-bold text-primary mt-1">
								{formatPrice(payment)}
								<span className="text-xs font-normal text-muted-foreground">
									/installment
								</span>
							</div>
							{/* <p className="text-xs text-muted-foreground mt-1">
								{option.description}
							</p> */}
						</button>
					);
				})}
			</div>
			<p className="text-xs text-muted-foreground flex items-center gap-1">
				<CreditCard className="h-3 w-3" />
				Interest-free installments via salary deduction
			</p>
		</div>
	);
}
