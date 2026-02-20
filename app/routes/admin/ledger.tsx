import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Download,
	BookOpen,
	ArrowUpRight,
	ArrowDownLeft,
	Banknote,
	Clock,
	TrendingUp,
	CircleDollarSign,
} from "lucide-react";
import { useGetFinancierConfigs } from "~/hooks/use-financier-config";
import { useGetLedger } from "~/hooks/use-financier-disbursement";

const fmt = (n: number) =>
	`₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-PH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const getStatusBadge = (status: string) => {
	switch (status) {
		case "COMPLETED":
		case "SETTLED":
			return (
				<Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
					{status}
				</Badge>
			);
		case "PENDING":
			return (
				<Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20">
					{status}
				</Badge>
			);
		case "OVERDUE":
		case "FAILED":
			return (
				<Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-500/20">
					{status}
				</Badge>
			);
		default:
			return (
				<Badge className="bg-muted text-muted-foreground">{status}</Badge>
			);
	}
};

const getEventTypeBadge = (eventType: string) => {
	switch (eventType) {
		case "LOAN":
			return (
				<Badge className="bg-chart-1/15 text-chart-1 hover:bg-chart-1/25 border-chart-1/20">
					<ArrowUpRight className="h-3 w-3 mr-1" />
					Loan
				</Badge>
			);
		case "REPAYMENT":
			return (
				<Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
					<ArrowDownLeft className="h-3 w-3 mr-1" />
					Repayment
				</Badge>
			);
		default:
			return (
				<Badge className="bg-muted text-muted-foreground">{eventType}</Badge>
			);
	}
};

export default function AdminLedger() {
	const { data: configData, isLoading: isConfigLoading } =
		useGetFinancierConfigs();
	const configs = configData?.financierConfigs || [];

	const [selectedConfigId, setSelectedConfigId] = useState<string>("");

	// Auto-select first config when data loads
	const activeConfigId =
		selectedConfigId || (configs.length > 0 ? configs[0].id : "");

	const {
		data: ledgerData,
		isLoading: isLedgerLoading,
		isError,
	} = useGetLedger(activeConfigId, "admin");

	const summary = ledgerData?.summary;
	const entries = ledgerData?.entries || [];

	const isLoading = isConfigLoading || isLedgerLoading;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Ledger</h1>
					<p className="text-muted-foreground">
						Track all loan disbursements, repayments, and outstanding balances.
					</p>
				</div>
				<div className="flex items-center gap-3">
					{configs.length > 1 && (
						<Select
							value={activeConfigId}
							onValueChange={setSelectedConfigId}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select organization" />
							</SelectTrigger>
							<SelectContent>
								{configs.map((config) => (
									<SelectItem key={config.id} value={config.id}>
										{config.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Button
						variant="outline"
						className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300">
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-chart-1/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-chart-1 rounded-bl-full">
						<BookOpen className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Entries
						</CardTitle>
						<div className="p-2 rounded-full bg-chart-1/10 text-chart-1">
							<BookOpen className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-20" />
						) : (
							<div className="text-2xl font-bold">
								{summary?.totalEntries ?? 0}
							</div>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							Total transactions
						</p>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-red-500/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-red-500 rounded-bl-full">
						<ArrowUpRight className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Debit
						</CardTitle>
						<div className="p-2 rounded-full bg-red-500/10 text-red-600">
							<Banknote className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-32" />
						) : (
							<div className="text-2xl font-bold text-red-600">
								{fmt(summary?.totalDebit ?? 0)}
							</div>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							Funds disbursed
						</p>
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-green-500/20">
					<div className="absolute top-0 right-0 p-3 opacity-10 text-green-500 rounded-bl-full">
						<ArrowDownLeft className="h-16 w-16" />
					</div>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Credit
						</CardTitle>
						<div className="p-2 rounded-full bg-green-500/10 text-green-600">
							<CircleDollarSign className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-32" />
						) : (
							<div className="text-2xl font-bold text-green-600">
								{fmt(summary?.totalCredit ?? 0)}
							</div>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							Repayments received
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
							<TrendingUp className="h-4 w-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-32" />
						) : (
							<div className="text-2xl font-bold text-amber-600">
								{fmt(summary?.outstandingBalance ?? 0)}
							</div>
						)}
						<p className="text-xs text-muted-foreground mt-1">
							Net amount owed
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Ledger Entries Table */}
			<Card className="shadow-md border-border/50">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-full bg-emerald-500/10">
							<Banknote className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<CardTitle>Ledger Entries</CardTitle>
							<CardDescription>
								All loan disbursements and repayment transactions
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : isError ? (
						<div className="text-center py-8 text-muted-foreground">
							Failed to load ledger data. Please try again.
						</div>
					) : entries.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No ledger entries found.
						</div>
					) : (
						<>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Description</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">
												Debit
											</TableHead>
											<TableHead className="text-right">
												Credit
											</TableHead>
											<TableHead className="text-right">
												Balance
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{entries.map(
											(entry: any, index: number) => (
												<TableRow key={`${entry.disbursementId}-${index}`}>
													<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
														{formatDate(entry.date)}
													</TableCell>
													<TableCell className="text-sm">
														<div>{entry.description}</div>
														{entry.orderNumber && (
															<span className="text-xs text-muted-foreground">
																{entry.orderNumber}
															</span>
														)}
													</TableCell>
													<TableCell>
														{getEventTypeBadge(
															entry.eventType,
														)}
													</TableCell>
													<TableCell>
														{getStatusBadge(entry.status)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{entry.debit > 0 ? (
															<span className="text-red-600">
																{fmt(entry.debit)}
															</span>
														) : (
															"—"
														)}
													</TableCell>
													<TableCell className="text-right font-medium">
														{entry.credit > 0 ? (
															<span className="text-green-600">
																{fmt(entry.credit)}
															</span>
														) : (
															"—"
														)}
													</TableCell>
													<TableCell className="text-right font-medium text-amber-600">
														{fmt(entry.balance)}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</div>
							<Separator className="my-4" />
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">
									Outstanding balance
								</span>
								<span className="text-lg font-bold text-amber-600">
									{fmt(summary?.outstandingBalance ?? 0)}
								</span>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
