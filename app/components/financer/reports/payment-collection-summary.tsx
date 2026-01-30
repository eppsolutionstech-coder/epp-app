import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface PaymentCollectionSummaryProps {
	paidCount: number;
	paidAmount: number;
	pendingCount: number;
	pendingAmount: number;
	overdueCount: number;
	overdueAmount: number;
}

export function PaymentCollectionSummary({
	paidCount,
	paidAmount,
	pendingCount,
	pendingAmount,
	overdueCount,
	overdueAmount,
}: PaymentCollectionSummaryProps) {
	return (
		<Card className="col-span-full">
			<CardHeader>
				<CardTitle>Payment Collection Summary</CardTitle>
				<CardDescription>Overview of payment status across all loans</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="flex flex-col items-center justify-center p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
						<div className="p-3 rounded-full bg-emerald-500/20 text-emerald-600 mb-3">
							<CheckCircle2 className="h-6 w-6" />
						</div>
						<p className="text-3xl font-bold text-emerald-700">{paidCount}</p>
						<p className="text-sm text-muted-foreground font-medium">
							Payments Collected
						</p>
						<p className="text-lg font-semibold text-emerald-600 mt-2">
							₱
							{paidAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>

					<div className="flex flex-col items-center justify-center p-6 bg-amber-500/10 rounded-lg border border-amber-500/20">
						<div className="p-3 rounded-full bg-amber-500/20 text-amber-600 mb-3">
							<Clock className="h-6 w-6" />
						</div>
						<p className="text-3xl font-bold text-amber-700">{pendingCount}</p>
						<p className="text-sm text-muted-foreground font-medium">
							Pending Payments
						</p>
						<p className="text-lg font-semibold text-amber-600 mt-2">
							₱
							{pendingAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>

					<div className="flex flex-col items-center justify-center p-6 bg-red-500/10 rounded-lg border border-red-500/20">
						<div className="p-3 rounded-full bg-red-500/20 text-red-600 mb-3">
							<AlertCircle className="h-6 w-6" />
						</div>
						<p className="text-3xl font-bold text-red-700">{overdueCount}</p>
						<p className="text-sm text-muted-foreground font-medium">
							Overdue Payments
						</p>
						<p className="text-lg font-semibold text-red-600 mt-2">
							₱
							{overdueAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
