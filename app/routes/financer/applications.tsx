import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
import { Eye, FileText } from "lucide-react";
import { useGetOrders } from "~/hooks/use-order";
import { useAuth } from "~/hooks/use-auth";
import type { OrderWithRelation } from "~/zod/order.zod";

const getStatusBadge = (status: string) => {
	switch (status) {
		case "PENDING":
			return <Badge variant="secondary">Pending</Badge>;
		case "UNDER_REVIEW":
			return (
				<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
					Under Review
				</Badge>
			);
		case "APPROVED":
			return (
				<Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
			);
		case "REJECTED":
			return <Badge variant="destructive">Rejected</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

const columns: DataTableColumn<OrderWithRelation>[] = [
	{
		key: "orderNumber",
		label: "Order Number",
		sortable: true,
		searchable: true,
		render: (value) => <span className="font-medium">{value as string}</span>,
	},
	{
		key: "userId",
		label: "Customer",
		sortable: true,
		searchable: true,
		render: (value) => (
			<div>
				<p className="font-medium text-xs font-mono">{value as string}</p>
			</div>
		),
	},
	{
		key: "orderItems",
		label: "Items",
		render: (_, row) => <span className="font-medium">{row.orderItems?.length || 0}</span>,
	},
	{
		key: "total",
		label: "Amount",
		sortable: true,
		className: "text-right",
		render: (value) => (
			<span className="font-medium">₱{(value as number).toLocaleString()}</span>
		),
	},
	{
		key: "installmentMonths",
		label: "Term",
		sortable: true,
		render: (value) => `${value} mo`,
	},
	{
		key: "status",
		label: "Status",
		filterable: true,
		filterOptions: [
			{ value: "PENDING", label: "Pending" },
			{ value: "UNDER_REVIEW", label: "Under Review" },
			{ value: "APPROVED", label: "Approved" },
			{ value: "REJECTED", label: "Rejected" },
		],
		render: (value) => getStatusBadge(value as string),
	},
	{
		key: "orderDate",
		label: "Date",
		sortable: true,
		render: (value) => (
			<span className="text-sm text-muted-foreground">
				{new Date(value as string).toLocaleDateString()}
			</span>
		),
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
	const { user } = useAuth();
	const { data: orders, isLoading } = useGetOrders({
		fields: "id, orderNumber, userId, status, orderDate, paymentType, paymentMethod, installmentMonths, installmentCount, installmentAmount, subtotal, tax, total, orderItems.id, approvals.id, approvals.approverId, approvals.approverEmail",
		// filter: `approvals.approverId=${user?.id}`,
		filter: `approvals.approverId=6969ceb5a1037f2809f62ce7`,
	});

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
					<CardDescription>{orders?.count || 0} application(s) found</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={(orders?.orders as unknown as OrderWithRelation[]) || []}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
