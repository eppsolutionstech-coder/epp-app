import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_FINANCER_STATS, MOCK_LOAN_APPLICATIONS, MOCK_PAYMENTS } from "~/data/mock-financer-data";
import { Wallet, FileText, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FinancerDashboard() {
	const stats = [
		{
			title: "Total Portfolio",
			value: `$${MOCK_FINANCER_STATS.totalPortfolio.toLocaleString()}`,
			description: "Active loan balance",
			icon: Wallet,
			color: "text-emerald-600",
		},
		{
			title: "Active Loans",
			value: MOCK_FINANCER_STATS.activeLoans,
			description: "Currently financed",
			icon: TrendingUp,
			color: "text-blue-600",
		},
		{
			title: "Pending Applications",
			value: MOCK_FINANCER_STATS.pendingApplications,
			description: "Awaiting review",
			icon: FileText,
			color: "text-amber-600",
		},
		{
			title: "Overdue Amount",
			value: `$${MOCK_FINANCER_STATS.overdueAmount.toLocaleString()}`,
			description: `${MOCK_FINANCER_STATS.defaultRate}% default rate`,
			icon: AlertTriangle,
			color: "text-red-600",
		},
	];

	const pendingApplications = MOCK_LOAN_APPLICATIONS.filter(
		(app) => app.status === "pending" || app.status === "under_review"
	);

	const recentPayments = MOCK_PAYMENTS.filter((p) => p.status === "paid").slice(0, 5);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your financing portfolio and activity.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<stat.icon className={`h-4 w-4 ${stat.color}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">{stat.description}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Pending Applications</CardTitle>
						<CardDescription>
							Loan applications awaiting your review.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{pendingApplications.length === 0 ? (
							<p className="text-sm text-muted-foreground">No pending applications</p>
						) : (
							<div className="space-y-4">
								{pendingApplications.map((app) => (
									<div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
										<div className="flex items-center gap-4">
											<div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
												<DollarSign className="h-5 w-5 text-emerald-600" />
											</div>
											<div>
												<p className="text-sm font-medium">{app.customerName}</p>
												<p className="text-xs text-muted-foreground">
													{app.productName} - ${app.requestedAmount.toLocaleString()}
												</p>
											</div>
										</div>
										<div className="text-right">
											<Badge
												variant={app.status === "pending" ? "secondary" : "outline"}
												className={app.status === "under_review" ? "bg-amber-100 text-amber-700" : ""}>
												{app.status === "under_review" ? "Under Review" : "Pending"}
											</Badge>
											<p className="text-xs text-muted-foreground mt-1">{app.appliedDate}</p>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common tasks and shortcuts.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-2">
						{[
							{ label: "Review Applications", href: "/financer/applications" },
							{ label: "View Active Loans", href: "/financer/loans" },
							{ label: "Check Overdue Payments", href: "/financer/payments" },
							{ label: "Generate Reports", href: "/financer/reports" },
						].map((action, i) => (
							<a
								key={i}
								href={action.href}
								className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
								<span className="text-sm font-medium">{action.label}</span>
								<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
							</a>
						))}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent Payments Received</CardTitle>
					<CardDescription>Latest payment transactions.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentPayments.map((payment) => (
							<div key={payment.id} className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
										<TrendingUp className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium">{payment.customerName}</p>
										<p className="text-xs text-muted-foreground">
											Loan {payment.loanId} - {payment.paymentMethod}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-green-600">
										+${payment.amount.toFixed(2)}
									</p>
									<p className="text-xs text-muted-foreground">{payment.paymentDate}</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
