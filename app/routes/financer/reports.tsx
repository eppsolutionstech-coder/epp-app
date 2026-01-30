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

export default function FinancerReports() {
	const activeLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "active");
	const completedLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "completed");
	const defaultedLoans = MOCK_ACTIVE_LOANS.filter((l) => l.status === "defaulted");

	const paidPayments = MOCK_PAYMENTS.filter((p) => p.status === "paid");
	const overduePayments = MOCK_PAYMENTS.filter((p) => p.status === "overdue");

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
		<div className="space-y-6">
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

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
						<DollarSign className="h-4 w-4 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							₱{MOCK_FINANCER_STATS.totalPortfolio.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground flex items-center gap-1">
							<TrendingUp className="h-3 w-3 text-green-500" />
							+12.5% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							₱{totalInterestEarned.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							From {paidPayments.length} payments
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Principal Collected</CardTitle>
						<DollarSign className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							₱{totalPrincipalCollected.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">Principal repayments</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Default Rate</CardTitle>
						<TrendingDown className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{MOCK_FINANCER_STATS.defaultRate}%</div>
						<p className="text-xs text-muted-foreground">
							{defaultedLoans.length} defaulted loans
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Loan Status Distribution</CardTitle>
						<CardDescription>Breakdown of loans by current status</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-blue-500" />
									<span className="text-sm">Active</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-medium">{activeLoans.length}</span>
									<span className="text-sm text-muted-foreground">
										(
										{(
											(activeLoans.length / MOCK_ACTIVE_LOANS.length) *
											100
										).toFixed(0)}
										%)
									</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-sm">Completed</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-medium">{completedLoans.length}</span>
									<span className="text-sm text-muted-foreground">
										(
										{(
											(completedLoans.length / MOCK_ACTIVE_LOANS.length) *
											100
										).toFixed(0)}
										%)
									</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<span className="text-sm">Defaulted</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-medium">{defaultedLoans.length}</span>
									<span className="text-sm text-muted-foreground">
										(
										{(
											(defaultedLoans.length / MOCK_ACTIVE_LOANS.length) *
											100
										).toFixed(0)}
										%)
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Loans by Customer Type</CardTitle>
						<CardDescription>Distribution across customer segments</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-blue-500" />
									<span className="text-sm">Employee</span>
								</div>
								<span className="font-medium">{loansByType.employee}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-purple-500" />
									<span className="text-sm">Retailer</span>
								</div>
								<span className="font-medium">{loansByType.retailer}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-cyan-500" />
									<span className="text-sm">Wholesaler</span>
								</div>
								<span className="font-medium">{loansByType.wholesaler}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-gray-500" />
									<span className="text-sm">Regular</span>
								</div>
								<span className="font-medium">{loansByType.regular}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Available Reports</CardTitle>
					<CardDescription>Generate and download detailed reports</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{reports.map((report) => (
							<div
								key={report.title}
								className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
								<div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
									<report.icon className="h-5 w-5 text-emerald-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium">{report.title}</p>
									<p className="text-sm text-muted-foreground">
										{report.description}
									</p>
									<Button
										variant="link"
										className="h-auto p-0 mt-2 text-emerald-600">
										<Download className="h-3 w-3 mr-1" />
										Download PDF
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Payment Collection Summary</CardTitle>
					<CardDescription>Overview of payment status</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="text-center p-6 bg-green-50 rounded-lg">
							<p className="text-3xl font-bold text-green-600">
								{paidPayments.length}
							</p>
							<p className="text-sm text-muted-foreground mt-1">Payments Collected</p>
							<p className="text-lg font-semibold text-green-600 mt-2">
								₱{paidPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
							</p>
						</div>
						<div className="text-center p-6 bg-amber-50 rounded-lg">
							<p className="text-3xl font-bold text-amber-600">
								{MOCK_PAYMENTS.filter((p) => p.status === "pending").length}
							</p>
							<p className="text-sm text-muted-foreground mt-1">Pending Payments</p>
							<p className="text-lg font-semibold text-amber-600 mt-2">
								₱
								{MOCK_PAYMENTS.filter((p) => p.status === "pending")
									.reduce((sum, p) => sum + p.amount, 0)
									.toFixed(2)}
							</p>
						</div>
						<div className="text-center p-6 bg-red-50 rounded-lg">
							<p className="text-3xl font-bold text-red-600">
								{overduePayments.length}
							</p>
							<p className="text-sm text-muted-foreground mt-1">Overdue Payments</p>
							<p className="text-lg font-semibold text-red-600 mt-2">
								₱{overduePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
