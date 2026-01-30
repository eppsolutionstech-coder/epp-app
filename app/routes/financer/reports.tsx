import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MOCK_FINANCER_STATS, MOCK_ACTIVE_LOANS, MOCK_PAYMENTS } from "~/data/mock-financer-data";
import {
	PieChart,
	Download,
	TrendingUp,
	TrendingDown,
	DollarSign,
	Users,
	FileText,
	Calendar,
} from "lucide-react";
import { StatsOverview } from "@/components/financer/reports/stats-overview";
import { LoanStatusChart } from "@/components/financer/reports/loan-status-chart";
import { CustomerTypeChart } from "@/components/financer/reports/customer-type-chart";
import { PaymentCollectionSummary } from "@/components/financer/reports/payment-collection-summary";

export default function FinancerReports() {
	const activeLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "active");
	const completedLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "completed");
	const defaultedLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "defaulted");

	const paidPayments = MOCK_PAYMENTS.filter((p) => p.status === "paid");
	const overduePayments = MOCK_PAYMENTS.filter((p) => p.status === "overdue");
	const pendingPayments = MOCK_PAYMENTS.filter((p) => p.status === "pending");

	const totalInterestEarned = paidPayments.reduce((sum, p) => sum + p.interestPortion, 0);
	const totalPrincipalCollected = paidPayments.reduce((sum, p) => sum + p.principalPortion, 0);

	const loansByType = {
		employee: MOCK_ACTIVE_LOANS.filter((l) => l.customerType === "employee").length,
		retailer: MOCK_ACTIVE_LOANS.filter((l) => l.customerType === "retailer").length,
		wholesaler: MOCK_ACTIVE_LOANS.filter((l) => l.customerType === "wholesaler").length,
		regular: MOCK_ACTIVE_LOANS.filter((l) => l.customerType === "regular").length,
	};

	const reports = [
		{
			title: "Portfolio Summary",
			description: "Overview of all active loans and their performance",
			icon: PieChart,
		},
		{
			title: "Collections Report",
			description: "Detailed breakdown of payments received",
			icon: DollarSign,
		},
		{
			title: "Delinquency Report",
			description: "Analysis of overdue and defaulted loans",
			icon: TrendingDown,
		},
		{
			title: "Customer Analysis",
			description: "Customer demographics and loan distribution",
			icon: Users,
		},
		{
			title: "Interest Income Report",
			description: "Interest earned from all active loans",
			icon: TrendingUp,
		},
		{
			title: "Aging Report",
			description: "Breakdown of receivables by age",
			icon: Calendar,
		},
	];

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Reports</h1>
					<p className="text-muted-foreground">
						Analytics and reports for your financing portfolio.
					</p>
				</div>
				<Select defaultValue="this-month">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="this-month">This Month</SelectItem>
						<SelectItem value="last-month">Last Month</SelectItem>
						<SelectItem value="this-quarter">This Quarter</SelectItem>
						<SelectItem value="this-year">This Year</SelectItem>
						<SelectItem value="all-time">All Time</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<StatsOverview
				totalInterestEarned={totalInterestEarned}
				totalPrincipalCollected={totalPrincipalCollected}
				defaultedLoansCount={defaultedLoans.length}
				paidPaymentsCount={paidPayments.length}
			/>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<div className="md:col-span-1 lg:col-span-4 transition-all duration-300 hover:shadow-md rounded-lg">
					<LoanStatusChart
						activeCount={activeLoans.length}
						completedCount={completedLoans.length}
						defaultedCount={defaultedLoans.length}
					/>
				</div>
				<div className="md:col-span-1 lg:col-span-3 transition-all duration-300 hover:shadow-md rounded-lg">
					<CustomerTypeChart loansByType={loansByType} />
				</div>
			</div>

			<PaymentCollectionSummary
				paidCount={paidPayments.length}
				paidAmount={paidPayments.reduce((sum, p) => sum + p.amount, 0)}
				pendingCount={pendingPayments.length}
				pendingAmount={pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
				overdueCount={overduePayments.length}
				overdueAmount={overduePayments.reduce((sum, p) => sum + p.amount, 0)}
			/>

			<div className="grid gap-6">
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle>Available Reports</CardTitle>
						<CardDescription>Generate and download detailed reports</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{reports.map((report) => (
								<div
									key={report.title}
									className="group flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer hover:border-primary/50">
									<div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
										<report.icon className="h-5 w-5 text-emerald-600" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium group-hover:text-primary transition-colors">
											{report.title}
										</p>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{report.description}
										</p>
										<Button
											variant="link"
											className="h-auto p-0 mt-2 text-emerald-600 group-hover:text-emerald-700">
											<Download className="h-3 w-3 mr-1" />
											Download PDF
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
