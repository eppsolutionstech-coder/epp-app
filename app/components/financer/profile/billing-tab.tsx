import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

export function FinancerBillingTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CreditCard className="h-5 w-5" />
					Billing Information
				</CardTitle>
				<CardDescription>Manage your billing details and payment methods.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="p-4 bg-emerald-50 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-emerald-700">Enterprise Plan</p>
							<p className="text-sm text-emerald-600">
								Unlimited loans, advanced reporting, priority support
							</p>
						</div>
						<Button variant="outline">Change Plan</Button>
					</div>
				</div>

				<Separator />

				<div>
					<h4 className="font-medium mb-4">Payment Method</h4>
					<div className="flex items-center gap-4 p-4 border rounded-lg">
						<div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
							VISA
						</div>
						<div className="flex-1">
							<p className="font-medium">**** **** **** 4242</p>
							<p className="text-sm text-muted-foreground">Expires 12/2025</p>
						</div>
						<Button variant="ghost" size="sm">
							Edit
						</Button>
					</div>
				</div>

				<Separator />

				<div>
					<h4 className="font-medium mb-4">Billing History</h4>
					<div className="space-y-2">
						{[
							{ date: "Jun 1, 2024", amount: "₱299.00", status: "Paid" },
							{ date: "May 1, 2024", amount: "₱299.00", status: "Paid" },
							{ date: "Apr 1, 2024", amount: "₱299.00", status: "Paid" },
						].map((invoice, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-3 border rounded-lg">
								<div>
									<p className="font-medium">{invoice.date}</p>
									<p className="text-sm text-muted-foreground">Enterprise Plan</p>
								</div>
								<div className="text-right">
									<p className="font-medium">{invoice.amount}</p>
									<p className="text-sm text-green-600">{invoice.status}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
