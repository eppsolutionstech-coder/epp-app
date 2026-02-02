import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
import { MOCK_ACTIVE_LOANS } from "~/data/mock-financer-data";
import { Eye, Wallet } from "lucide-react";

type ActiveLoan = (typeof MOCK_ACTIVE_LOANS)[number];

const getStatusBadge = (status: string) => {
	switch (status) {
		case "active":
			return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>;
		case "completed":
			return (
				<Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
			);
		case "defaulted":
			return <Badge variant="destructive">Defaulted</Badge>;
		case "restructured":
			return (
				<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
					Restructured
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

const columns: DataTableColumn<ActiveLoan>[] = [
	{
		key: "id",
		label: "Loan ID",
		sortable: true,
		searchable: true,
		render: (value) => <span className="font-medium">{value}</span>,
	},
	{
		key: "customerName",
		label: "Customer",
		sortable: true,
		searchable: true,
		render: (_, row) => (
			<div>
				<p className="font-medium">{row.customerName}</p>
				<p className="text-xs text-muted-foreground">{row.customerType}</p>
			</div>
		),
	},
	{
		key: "productName",
		label: "Product",
		searchable: true,
		render: (_, row) => (
			<div className="flex items-center gap-2">
				{row.productImage && (
					<img
						src={row.productImage}
						alt={row.productName}
						className="h-8 w-8 rounded object-cover"
					/>
				)}
				<span className="text-sm truncate max-w-[120px]">{row.productName}</span>
			</div>
		),
	},
	{
		key: "principalAmount",
		label: "Principal",
		sortable: true,
		className: "text-right",
		render: (value) => `₱${(value as number).toLocaleString()}`,
	},
	{
		key: "id", // Using ID as key but rendering progress
		label: "Progress",
		render: (_, row) => {
			const progressPercent = (row.paidInstallments / row.term) * 100;
			return (
				<div className="w-24">
					<Progress value={progressPercent} className="h-2" />
					<p className="text-xs text-muted-foreground mt-1">
						{row.paidInstallments}/{row.term} paid
					</p>
				</div>
			);
		},
	},
	{
		key: "remainingAmount",
		label: "Remaining",
		sortable: true,
		className: "text-right font-medium",
		render: (value) => `₱${(value as number).toLocaleString()}`,
	},
	{
		key: "nextPaymentDate",
		label: "Next Payment",
		sortable: true,
		render: (value) => <span className="text-sm">{value || "-"}</span>,
	},
	{
		key: "status",
		label: "Status",
		filterable: true,
		filterOptions: [
			{ value: "active", label: "Active" },
			{ value: "completed", label: "Completed" },
			{ value: "defaulted", label: "Defaulted" },
			{ value: "restructured", label: "Restructured" },
		],
		render: (value) => getStatusBadge(value as string),
	},
	{
		key: "id",
		label: "Actions",
		className: "text-right",
		render: (value) => (
			<Button variant="ghost" size="sm" asChild>
				<Link to={`/financer/loans/${value}`}>
					<Eye className="h-4 w-4 mr-1" />
					View
				</Link>
			</Button>
		),
	},
];

export default function FinancerLoans() {
	const totalPortfolio = MOCK_ACTIVE_LOANS.reduce((sum, loan) => sum + loan.remainingAmount, 0);
	const activeCount = MOCK_ACTIVE_LOANS.filter((l) => l.status === "active").length;
	const completedCount = MOCK_ACTIVE_LOANS.filter((l) => l.status === "completed").length;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Active Loans</h1>
				<p className="text-muted-foreground">Manage and track all financed loans.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card className="shadow-sm border-border/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">₱{totalPortfolio.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							Across {activeCount} active loans
						</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm border-border/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Active Loans</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeCount}</div>
						<p className="text-xs text-muted-foreground">Currently being serviced</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm border-border/50">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Completed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{completedCount}</div>
						<p className="text-xs text-muted-foreground">Fully paid off</p>
					</CardContent>
				</Card>
			</div>

			<Card className="shadow-md border-border/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<div className="p-2 rounded-full bg-primary/10 text-primary">
							<Wallet className="h-4 w-4" />
						</div>
						Loans
					</CardTitle>
					<CardDescription>{MOCK_ACTIVE_LOANS.length} loan(s) found</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={MOCK_ACTIVE_LOANS} />
				</CardContent>
			</Card>
		</div>
	);
}
