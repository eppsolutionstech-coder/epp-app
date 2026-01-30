import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { MOCK_FINANCER_STATS } from "~/data/mock-financer-data";

interface StatsOverviewProps {
	totalInterestEarned: number;
	totalPrincipalCollected: number;
	defaultedLoansCount: number;
	paidPaymentsCount: number;
}

export function StatsOverview({
	totalInterestEarned,
	totalPrincipalCollected,
	defaultedLoansCount,
	paidPaymentsCount,
}: StatsOverviewProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-emerald-500/20">
				<div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-600 rounded-bl-full">
					<DollarSign className="h-16 w-16" />
				</div>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total Portfolio
					</CardTitle>
					<div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
						<DollarSign className="h-4 w-4" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						₱{MOCK_FINANCER_STATS.totalPortfolio.toLocaleString()}
					</div>
					<p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
						<TrendingUp className="h-3 w-3 text-green-500" />
						<span className="text-green-500 font-medium">+12.5%</span> from last month
					</p>
				</CardContent>
			</Card>

			<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-green-500/20">
				<div className="absolute top-0 right-0 p-3 opacity-10 text-green-600 rounded-bl-full">
					<TrendingUp className="h-16 w-16" />
				</div>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Interest Earned
					</CardTitle>
					<div className="p-2 rounded-full bg-green-500/10 text-green-600">
						<TrendingUp className="h-4 w-4" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">
						₱
						{totalInterestEarned.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						From {paidPaymentsCount} payments
					</p>
				</CardContent>
			</Card>

			<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-blue-500/20">
				<div className="absolute top-0 right-0 p-3 opacity-10 text-blue-600 rounded-bl-full">
					<DollarSign className="h-16 w-16" />
				</div>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Principal Collected
					</CardTitle>
					<div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
						<DollarSign className="h-4 w-4" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-blue-600">
						₱
						{totalPrincipalCollected.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
					<p className="text-xs text-muted-foreground mt-1">Principal repayments</p>
				</CardContent>
			</Card>

			<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-red-500/20">
				<div className="absolute top-0 right-0 p-3 opacity-10 text-red-600 rounded-bl-full">
					<TrendingDown className="h-16 w-16" />
				</div>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Default Rate
					</CardTitle>
					<div className="p-2 rounded-full bg-red-500/10 text-red-600">
						<TrendingDown className="h-4 w-4" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{MOCK_FINANCER_STATS.defaultRate}%</div>
					<p className="text-xs text-muted-foreground mt-1">
						{defaultedLoansCount} defaulted loans
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
