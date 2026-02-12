import { useMemo } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	MOCK_SOA_TRANSACTIONS,
	MOCK_SOA_MONTHLY,
	MOCK_SOA_TOTALS,
} from "~/data/mock-financer-data";
import {
	Download,
	ArrowUpRight,
	ArrowDownLeft,
	Banknote,
	TrendingUp,
	Clock,
	CircleDollarSign,
	Handshake,
	ReceiptText,
} from "lucide-react";

const fmt = (n: number) =>
	`₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const monthLabel = (m: string) => {
	const [year, month] = m.split("-");
	const date = new Date(Number(year), Number(month) - 1);
	return date.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
};

export default function FinancerStatements() {
	const totals = MOCK_SOA_TOTALS;
	const transactions = MOCK_SOA_TRANSACTIONS;
	const monthly = MOCK_SOA_MONTHLY;

	const repaymentProgress = useMemo(
		() =>
			totals.totalFundsReleased > 0
				? (totals.totalRepaymentReceived / totals.totalFundsReleased) * 100
				: 0,
		[totals],
	);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Statement of Account
					</h1>
					<p className="text-muted-foreground">
						Your financial ledger with Uzaro — funds lent, repayments received, and balance.
					</p>
				</div>
				<Button
					variant="outline"
					className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300">
					<Download className="h-4 w-4 mr-2" />
					Export SOA
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-chart-1/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-chart-1 rounded-bl-full">
						<ArrowUpRight className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Funds Lent
						</CardTitle>
						<div className="p-2 rounded-full bg-chart-1/10 text-chart-1">
							<Banknote className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{fmt(totals.totalFundsReleased)}</div>
						<p className="text-xs text-muted-foreground mt-1">
							{totals.totalOrdersFunded} orders funded
						</p>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-green-500/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-green-500 rounded-bl-full">
						<ArrowDownLeft className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Repaid
						</CardTitle>
						<div className="p-2 rounded-full bg-green-500/10 text-green-600">
							<CircleDollarSign className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{fmt(totals.totalRepaymentReceived)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{totals.totalOrdersSettled} of {totals.totalOrdersFunded} orders settled
						</p>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-amber-500/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-amber-500 rounded-bl-full">
						<Clock className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Outstanding Balance
						</CardTitle>
						<div className="p-2 rounded-full bg-amber-500/10 text-amber-600">
							<Clock className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-amber-600">
							{fmt(totals.totalOutstandingBalance)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Uzaro owes to you
						</p>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-emerald-500/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-500 rounded-bl-full">
						<TrendingUp className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Interest Earned
						</CardTitle>
						<div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
							<TrendingUp className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-emerald-600">
							{fmt(totals.totalInterestEarned)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Your {totals.revenueShareRatio} share of interest
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Repayment Progress */}
			<Card className="shadow-md border-border/50">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-full bg-emerald-500/10">
							<Handshake className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<CardTitle>Repayment Progress</CardTitle>
							<CardDescription>
								How much Uzaro has repaid against total funds lent
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between text-sm mb-2">
						<span className="text-muted-foreground">
							{fmt(totals.totalRepaymentReceived)} repaid
						</span>
						<span className="font-medium">
							of {fmt(totals.totalFundsReleased)} lent
						</span>
					</div>
					<Progress value={repaymentProgress} className="h-4" />
					<p className="text-xs text-muted-foreground mt-2 text-right">
						{repaymentProgress.toFixed(1)}% collected
					</p>
				</CardContent>
			</Card>

			{/* Monthly Summary */}
			<Card className="shadow-md border-border/50">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-full bg-emerald-500/10">
							<ReceiptText className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<CardTitle>Monthly Summary</CardTitle>
							<CardDescription>
								Monthly breakdown of funds lent and repayments received from Uzaro
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Month</TableHead>
									<TableHead className="text-right">Funds Lent</TableHead>
									<TableHead className="text-right">Repayment Received</TableHead>
									<TableHead className="text-right">Interest Earned</TableHead>
									<TableHead className="text-right">Orders Funded</TableHead>
									<TableHead className="text-right">Orders Settled</TableHead>
									<TableHead className="text-right">Net Flow</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{monthly.map((row) => {
									const netFlow = row.repaymentReceived - row.fundsReleased;
									return (
										<TableRow key={row.month}>
											<TableCell className="font-medium">
												{monthLabel(row.month)}
											</TableCell>
											<TableCell className="text-right text-chart-1">
												{row.fundsReleased > 0 ? fmt(row.fundsReleased) : "—"}
											</TableCell>
											<TableCell className="text-right text-green-600">
												{row.repaymentReceived > 0
													? fmt(row.repaymentReceived)
													: "—"}
											</TableCell>
											<TableCell className="text-right text-emerald-600 font-medium">
												{row.interestEarned > 0
													? fmt(row.interestEarned)
													: "—"}
											</TableCell>
											<TableCell className="text-right">
												{row.ordersApproved > 0 ? row.ordersApproved : "—"}
											</TableCell>
											<TableCell className="text-right">
												{row.ordersSettled > 0 ? row.ordersSettled : "—"}
											</TableCell>
											<TableCell className="text-right font-medium">
												{netFlow >= 0 ? (
													<span className="text-green-600">
														+{fmt(netFlow)}
													</span>
												) : (
													<span className="text-chart-1">
														{fmt(netFlow)}
													</span>
												)}
											</TableCell>
										</TableRow>
									);
								})}
								{/* Totals row */}
								<TableRow className="bg-muted/50 font-semibold">
									<TableCell>Total</TableCell>
									<TableCell className="text-right text-chart-1">
										{fmt(monthly.reduce((s, r) => s + r.fundsReleased, 0))}
									</TableCell>
									<TableCell className="text-right text-green-600">
										{fmt(monthly.reduce((s, r) => s + r.repaymentReceived, 0))}
									</TableCell>
									<TableCell className="text-right text-emerald-600">
										{fmt(monthly.reduce((s, r) => s + r.interestEarned, 0))}
									</TableCell>
									<TableCell className="text-right">
										{monthly.reduce((s, r) => s + r.ordersApproved, 0)}
									</TableCell>
									<TableCell className="text-right">
										{monthly.reduce((s, r) => s + r.ordersSettled, 0)}
									</TableCell>
									<TableCell className="text-right">
										{(() => {
											const net = monthly.reduce(
												(s, r) => s + r.repaymentReceived - r.fundsReleased,
												0,
											);
											return net >= 0 ? (
												<span className="text-green-600">+{fmt(net)}</span>
											) : (
												<span className="text-chart-1">{fmt(net)}</span>
											);
										})()}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Transaction Ledger */}
			<Card className="shadow-md border-border/50">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-full bg-emerald-500/10">
							<Banknote className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<CardTitle>Transaction Ledger</CardTitle>
							<CardDescription>
								All fund releases and repayments between you and Uzaro
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead className="text-right">Running Balance</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{transactions.map((txn) => (
									<TableRow key={txn.id}>
										<TableCell className="text-sm text-muted-foreground">
											{txn.date}
										</TableCell>
										<TableCell className="text-sm">{txn.description}</TableCell>
										<TableCell>
											{txn.type === "release" ? (
												<Badge className="bg-chart-1/15 text-chart-1 hover:bg-chart-1/25 border-chart-1/20">
													<ArrowUpRight className="h-3 w-3 mr-1" />
													Release
												</Badge>
											) : (
												<Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
													<ArrowDownLeft className="h-3 w-3 mr-1" />
													Repayment
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-right font-medium">
											{txn.type === "release" ? (
												<span className="text-chart-1">
													-{fmt(txn.amount)}
												</span>
											) : (
												<span className="text-green-600">
													+{fmt(txn.amount)}
												</span>
											)}
										</TableCell>
										<TableCell className="text-right font-medium text-amber-600">
											{fmt(txn.runningBalance)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Separator className="my-4" />
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Current outstanding balance (Uzaro owes you)
						</span>
						<span className="text-lg font-bold text-amber-600">
							{fmt(totals.totalOutstandingBalance)}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
