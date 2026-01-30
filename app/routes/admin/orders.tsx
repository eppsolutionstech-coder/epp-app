import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Truck, CheckCircle, Package, Clock } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
// import { useGetOrders } from "~/hooks/use-order";
import type { Order } from "~/zod/order.zod";

const MOCK_ORDERS = [
	{
		id: "1",
		orderNumber: "ORD-2024-001",
		employeeId: "EMP001",
		status: "PENDING_APPROVAL",
		orderItems: [{ id: "item1" }, { id: "item2" }],
		total: 15600.0,
		orderDate: new Date("2024-01-28").toISOString(),
		customer: {
			name: "Juan Dela Cruz",
			email: "juan.delacruz@company.com",
		},
	},
	{
		id: "2",
		orderNumber: "ORD-2024-002",
		employeeId: "EMP002",
		status: "APPROVED",
		orderItems: [{ id: "item3" }],
		total: 2500.5,
		orderDate: new Date("2024-01-27").toISOString(),
		customer: {
			name: "Maria Santos",
			email: "maria.santos@company.com",
		},
	},
	{
		id: "3",
		orderNumber: "ORD-2024-003",
		employeeId: "EMP003",
		status: "PROCESSING",
		orderItems: [{ id: "item4" }, { id: "item5" }, { id: "item6" }],
		total: 45000.0,
		orderDate: new Date("2024-01-26").toISOString(),
		customer: {
			name: "Jose Reyes",
			email: "jose.reyes@company.com",
		},
	},
	{
		id: "4",
		orderNumber: "ORD-2024-004",
		employeeId: "EMP004",
		status: "SHIPPED",
		orderItems: [{ id: "item7" }],
		total: 8900.0,
		orderDate: new Date("2024-01-25").toISOString(),
		customer: {
			name: "Ana Garcia",
			email: "ana.garcia@company.com",
		},
	},
	{
		id: "5",
		orderNumber: "ORD-2024-005",
		employeeId: "EMP005",
		status: "DELIVERED",
		orderItems: [{ id: "item8" }, { id: "item9" }],
		total: 1200.0,
		orderDate: new Date("2024-01-24").toISOString(),
		customer: {
			name: "Pedro Penduko",
			email: "pedro.penduko@company.com",
		},
	},
	{
		id: "6",
		orderNumber: "ORD-2024-006",
		employeeId: "EMP006",
		status: "CANCELLED",
		orderItems: [{ id: "item10" }],
		total: 500.0,
		orderDate: new Date("2024-01-23").toISOString(),
		customer: {
			name: "Cardo Dalisay",
			email: "cardo.dalisay@company.com",
		},
	},
];

export default function AdminOrdersPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// const { data: ordersResponse, isLoading } = useGetOrders({
	// 	fields: "id, orderNumber, employeeId, status, orderItems.id, total, orderDate",
	// 	count: true,
	// });

	// const orders = ordersResponse?.orders || [];
	// const totalDocs = ordersResponse?.count || 0;

	const isLoading = false;
	const orders = MOCK_ORDERS;
	const totalDocs = MOCK_ORDERS.length;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING_APPROVAL":
				return "bg-yellow-500 hover:bg-yellow-600";
			case "APPROVED":
				return "bg-emerald-500 hover:bg-emerald-600";
			case "PROCESSING":
				return "bg-purple-500 hover:bg-purple-600";
			case "SHIPPED":
				return "bg-indigo-500 hover:bg-indigo-600";
			case "DELIVERED":
				return "bg-green-500 hover:bg-green-600";
			case "CANCELLED":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-gray-500 hover:bg-gray-600";
		}
	};

	const handleViewDetails = (order: Order) => {
		// Navigate to admin order details
		navigate(`/admin/orders/${order.id}`);
	};

	const columns: DataTableColumn<any>[] = [
		{
			key: "orderNumber",
			label: "Order ID",
			sortable: true,
			searchable: true,
			className: "font-mono",
			render: (value) => <span>{value || "N/A"}</span>,
		},
		{
			key: "customer",
			label: "Customer",
			render: (_, row: any) => (
				<div className="flex flex-col">
					<span className="font-medium">{row.customer?.name || "Unknown"}</span>
					<span className="text-xs text-muted-foreground">
						{row.customer?.email || "No email"}
					</span>
				</div>
			),
		},
		{
			key: "orderItems",
			label: "Items",
			render: (_, row) => (
				<Badge variant="outline" className="font-normal">
					{row.orderItems?.length || 0} item
					{(row.orderItems?.length || 0) !== 1 ? "s" : ""}
				</Badge>
			),
		},

		{
			key: "total",
			label: "Amount",
			sortable: true,
			render: (value) =>
				`₱${Number(value || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
		},
		{
			key: "orderDate",
			label: "Date",
			sortable: true,
			render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Pending", value: "PENDING_APPROVAL" },
				{ label: "Approved", value: "APPROVED" },
				{ label: "Processing", value: "PROCESSING" },
				{ label: "Shipped", value: "SHIPPED" },
				{ label: "Delivered", value: "DELIVERED" },
				{ label: "Cancelled", value: "CANCELLED" },
			],
			render: (value) => (
				<Badge className={getStatusColor(String(value))}>
					{String(value).replace("_", " ").toLowerCase()}
				</Badge>
			),
		},
		{
			key: "id",
			label: "Actions",
			className: "text-right",
			render: (_, row) => (
				<div className="flex items-center justify-end gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							handleViewDetails(row);
						}}>
						<Eye className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Orders</h1>
					<p className="text-muted-foreground">Manage and track all employee orders.</p>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 sm:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 flex items-center justify-center">
								<Clock className="h-5 w-5 text-yellow-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Pending</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
								<Package className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Processing</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
								<Truck className="h-5 w-5 text-indigo-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Shipped</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
								<CheckCircle className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Delivered</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Orders</CardTitle>
					<CardDescription>
						{totalDocs} order{totalDocs !== 1 ? "s" : ""} found
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={orders}
						onRowClick={(row) => handleViewDetails(row)}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
