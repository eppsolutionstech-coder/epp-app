import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Truck, CheckCircle, Package, Clock } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
import { useGetOrders } from "~/hooks/use-order";
import type { Order } from "~/zod/order.zod";

export default function supplierOrdersPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const { data: ordersResponse, isLoading } = useGetOrders({
		fields: "id, orderNumber, userId, status, orderItems.id, total, orderDate",
		count: true,
	});

	const orders = ordersResponse?.orders || [];
	const totalDocs = ordersResponse?.count || 0;

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
		navigate(`/supplier/orders/${order.id}`);
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
					<p className="text-muted-foreground">Manage and fulfill employee orders.</p>
				</div>
			</div>

			{/* Summary Cards - TODO: Wire up with aggregation API */}
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

