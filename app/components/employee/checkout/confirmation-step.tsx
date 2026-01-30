import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import type { CheckoutItem } from "./checkout-utils";
import { formatPrice } from "./checkout-utils";
import { CheckoutItemCard } from "./checkout-item-card";

interface ConfirmationStepProps {
	items: CheckoutItem[];
	subtotal: number;
	total: number;
	selectedInstallments: number;
	perInstallment: number;
	onBack: () => void;
	onConfirm: () => void;
	isSubmitting?: boolean;
}

export function ConfirmationStep({
	items,
	subtotal,
	total,
	selectedInstallments,
	perInstallment,
	onBack,
	onConfirm,
	isSubmitting = false,
}: ConfirmationStepProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6 sm:p-8">
				<div className="space-y-6">
					<div>
						<h3 className="font-semibold text-lg mb-2">Confirm Your Order</h3>
						<p className="text-muted-foreground text-sm">
							Please review your order details before confirming
						</p>
					</div>

					{/* Order Items - Compact view */}
					<div className="space-y-3">
						{items.map((item) => (
							<CheckoutItemCard key={item.itemId} item={item} compact />
						))}
					</div>

					{/* Payment Details */}
					<div className="bg-muted/30 rounded-xl p-5 space-y-3">
						<h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
							Payment Details
						</h4>
						<div className="grid grid-cols-3 gap-4 text-center">
							<div className="bg-background rounded-lg p-3">
								<p className="text-xs text-muted-foreground">Total</p>
								<p className="font-semibold">{formatPrice(total)}</p>
							</div>
							<div className="bg-background rounded-lg p-3">
								<p className="text-xs text-muted-foreground">Installments</p>
								<p className="font-semibold">{selectedInstallments}x</p>
							</div>
							<div className="bg-background rounded-lg p-3">
								<p className="text-xs text-muted-foreground">Per Cutoff</p>
								<p className="font-semibold text-primary">
									{formatPrice(perInstallment)}
								</p>
							</div>
						</div>
					</div>

					{/* Agreement Notice */}
					<div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
						<p className="text-sm text-amber-800 dark:text-amber-200">
							By confirming this order, you agree to payroll deductions of{" "}
							<span className="font-semibold">{formatPrice(perInstallment)}</span> for{" "}
							{selectedInstallments} installments until the products are fully paid.
						</p>
					</div>

					<div className="flex justify-between pt-2">
						<Button
							variant="outline"
							onClick={onBack}
							size="lg"
							className="rounded-full"
							disabled={isSubmitting}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Button>
						<Button
							onClick={onConfirm}
							size="lg"
							className="rounded-full px-8 bg-green-600 hover:bg-green-700"
							disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Placing Order...
								</>
							) : (
								<>
									<Check className="mr-2 h-4 w-4" />
									Confirm Order
								</>
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
