import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Truck, CheckCircle, Package, Clock } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
import { useGetPurchaseOrders } from "~/hooks/use-purchase-order";
import { useAuth } from "~/hooks/use-auth";
import type { PurchaseOrderWithRelations } from "~/zod/purchaseOrder.zod";

export default function supplierOrdersPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { user } = useAuth();

	const { data: purchaseOrdersResponse, isLoading } = useGetPurchaseOrders({
		fields: "id,poNumber,orderId,supplierId,status,items,approvedAt,sentToSupplierAt,notes,createdAt,updatedAt,supplier,totalAmount",
		filter: `supplier.code:${user?.metadata?.supplier?.code}`,
		count: true,
	});

	const purchaseOrders = purchaseOrdersResponse?.purchaseOrders || [];
	const totalDocs = purchaseOrdersResponse?.count || 0;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-500 hover:bg-yellow-600";
			case "APPROVED":
				return "bg-blue-500 hover:bg-blue-600";
			case "SENT":
				return "bg-purple-500 hover:bg-purple-600";
			case "CONFIRMED":
				return "bg-indigo-500 hover:bg-indigo-600";
			case "SHIPPED":
				return "bg-orange-500 hover:bg-orange-600";
			case "RECEIVED":
			case "COMPLETED":
				return "bg-green-500 hover:bg-green-600";
			case "CANCELLED":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-gray-500 hover:bg-gray-600";
		}
	};

	const handleViewDetails = (po: PurchaseOrderWithRelations) => {
		navigate(`/supplier/orders/${po.id}`);
	};

	const columns: DataTableColumn<PurchaseOrderWithRelations>[] = [
		{
			key: "poNumber",
			label: "PO Number",
			sortable: true,
			searchable: true,
			className: "font-mono",
			render: (value) => <span>{(value as string) || "N/A"}</span>,
		},
		{
			key: "items",
			label: "Items",
			render: (_, row) => (
				<Badge variant="outline" className="font-normal">
					{row.items?.length || 0} item
					{(row.items?.length || 0) !== 1 ? "s" : ""}
				</Badge>
			),
		},
		{
			key: "createdAt",
			label: "Date Created",
			sortable: true,
			render: (value) =>
				value ? new Date(value as string | Date).toLocaleDateString() : "-",
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Pending", value: "PENDING" },
				{ label: "Approved", value: "APPROVED" },
				{ label: "Sent", value: "SENT" },
				{ label: "Confirmed", value: "CONFIRMED" },
				{ label: "Shipped", value: "SHIPPED" },
				{ label: "Received", value: "RECEIVED" },
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
					<h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
					<p className="text-muted-foreground">Manage and fulfill purchase orders.</p>
				</div>
			</div>

			{/* Summary Cards - Placeholder for now */}
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
							<div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
								<CheckCircle className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Approved</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center">
								<Truck className="h-5 w-5 text-orange-600" />
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
								<Package className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">--</p>
								<p className="text-xs text-muted-foreground">Completed</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Purchase Orders</CardTitle>
					<CardDescription>
						{totalDocs} order{totalDocs !== 1 ? "s" : ""} found
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={purchaseOrders}
						onRowClick={(row) => handleViewDetails(row)}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
