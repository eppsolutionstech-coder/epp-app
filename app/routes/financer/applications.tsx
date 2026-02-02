import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
import { MOCK_LOAN_APPLICATIONS } from "~/data/mock-financer-data";
import { Eye, FileText } from "lucide-react";

type LoanApplication = (typeof MOCK_LOAN_APPLICATIONS)[number];

const getStatusBadge = (status: string) => {
	switch (status) {
		case "pending":
			return <Badge variant="secondary">Pending</Badge>;
		case "under_review":
			return (
				<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
					Under Review
				</Badge>
			);
		case "approved":
			return (
				<Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
			);
		case "rejected":
			return <Badge variant="destructive">Rejected</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

const getCustomerTypeBadge = (type: string) => {
	const colors: Record<string, string> = {
		employee: "bg-blue-100 text-blue-700",
		retailer: "bg-purple-100 text-purple-700",
		wholesaler: "bg-cyan-100 text-cyan-700",
		regular: "bg-gray-100 text-gray-700",
	};
	return (
		<Badge className={`${colors[type] || "bg-gray-100 text-gray-700"} hover:opacity-80`}>
			{type.charAt(0).toUpperCase() + type.slice(1)}
		</Badge>
	);
};

const columns: DataTableColumn<LoanApplication>[] = [
	{
		key: "id",
		label: "Application ID",
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
				<p className="text-xs text-muted-foreground">{row.customerEmail}</p>
			</div>
		),
	},
	{
		key: "customerType",
		label: "Type",
		filterable: true,
		filterOptions: [
			{ value: "employee", label: "Employee" },
			{ value: "retailer", label: "Retailer" },
			{ value: "wholesaler", label: "Wholesaler" },
			{ value: "regular", label: "Regular" },
		],
		render: (value) => getCustomerTypeBadge(value as string),
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
				<span className="text-sm truncate max-w-[150px]">{row.productName}</span>
			</div>
		),
	},
	{
		key: "requestedAmount",
		label: "Amount",
		sortable: true,
		className: "text-right",
		render: (value) => (
			<span className="font-medium">₱{(value as number).toLocaleString()}</span>
		),
	},
	{
		key: "requestedTerm",
		label: "Term",
		sortable: true,
		render: (value) => `${value} mo`,
	},
	{
		key: "status",
		label: "Status",
		filterable: true,
		filterOptions: [
			{ value: "pending", label: "Pending" },
			{ value: "under_review", label: "Under Review" },
			{ value: "approved", label: "Approved" },
			{ value: "rejected", label: "Rejected" },
		],
		render: (value) => getStatusBadge(value as string),
	},
	{
		key: "appliedDate",
		label: "Date",
		sortable: true,
		render: (value) => <span className="text-sm text-muted-foreground">{value as string}</span>,
	},
	{
		key: "id",
		label: "Actions",
		className: "text-right",
		render: (value) => (
			<Button variant="ghost" size="sm" asChild>
				<Link to={`/financer/applications/${value}`}>
					<Eye className="h-4 w-4 mr-1" />
					View
				</Link>
			</Button>
		),
	},
];

export default function FinancerApplications() {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
				<p className="text-muted-foreground">
					Review and manage loan applications from customers.
				</p>
			</div>

			<Card className="shadow-md border-border/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<div className="p-2 rounded-full bg-primary/10 text-primary">
							<FileText className="h-4 w-4" />
						</div>
						Applications
					</CardTitle>
					<CardDescription>
						{MOCK_LOAN_APPLICATIONS.length} application(s) found
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={MOCK_LOAN_APPLICATIONS} />
				</CardContent>
			</Card>
		</div>
	);
}
