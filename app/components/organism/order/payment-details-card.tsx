import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface PaymentDetailsCardProps {
	order: any;
}

export function PaymentDetailsCard({ order }: PaymentDetailsCardProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
			<div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/50">
				<div className="p-6 flex-1 flex flex-col justify-center">
					<div className="flex items-center gap-2 mb-4 text-muted-foreground">
						<CreditCard className="h-4 w-4" />
						<span className="text-sm font-medium">Payment Method</span>
					</div>
					<p className="font-semibold text-lg flex items-center gap-2">
						{order.paymentMethod?.replace("_", " ")}
						{order.paymentType === "INSTALLMENT" && (
							<Badge variant="secondary" className="text-xs font-normal">
								Monthly
							</Badge>
						)}
					</p>
					{order.paymentType === "INSTALLMENT" && (
						<p className="text-sm text-muted-foreground mt-1">
							{order.installmentMonths} months term -{" "}
							{formatCurrency(order.installmentAmount || 0)}/mo
						</p>
					)}
				</div>
				<div className="p-6 flex-1 bg-muted/10 space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span>{formatCurrency(order.subtotal || order.total)}</span>
					</div>
					{order.tax > 0 && (
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Tax</span>
							<span>{formatCurrency(order.tax)}</span>
						</div>
					)}
					<div className="flex justify-between text-base font-bold pt-2 border-t border-dashed border-muted-foreground/30">
						<span>Total Paid</span>
						<span>{formatCurrency(order.total)}</span>
					</div>
				</div>
			</div>
		</Card>
	);
}
