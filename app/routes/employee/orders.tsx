import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	MOCK_EMPLOYEE_PURCHASES,
	MOCK_ORDERS,
	type EmployeePurchase,
	type Order,
} from "~/data/mock-admin-data";
import { Package, FileText, Download, Eye } from "lucide-react";

export default function EmployeeOrdersPage() {
	const [selectedOrder, setSelectedOrder] = useState<EmployeePurchase | Order | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	const purchases = MOCK_EMPLOYEE_PURCHASES;
	const activePurchases = purchases.filter((p) => p.status === "active");
	const completedPurchases = purchases.filter((p) => p.status === "completed");

	// Get pending orders for current employee
	const pendingOrders = MOCK_ORDERS.filter(
		(o) =>
			o.employeeId === "EMP-001" &&
			["pending", "approved", "processing", "shipped"].includes(o.status),
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-blue-500";
			case "completed":
				return "bg-green-500";
			case "pending":
				return "bg-yellow-500";
			case "approved":
				return "bg-emerald-500";
			case "processing":
				return "bg-purple-500";
			case "shipped":
				return "bg-indigo-500";
			case "delivered":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const handleViewDetails = (item: EmployeePurchase | Order) => {
		setSelectedOrder(item);
		setIsDetailOpen(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
				<p className="text-muted-foreground">
					View and manage your EPP purchases and orders
				</p>
			</div>

			<Tabs defaultValue="active" className="space-y-6">
				<TabsList>
					<TabsTrigger value="active">
						Active Purchases ({activePurchases.length})
					</TabsTrigger>
					<TabsTrigger value="pending">
						Pending Orders ({pendingOrders.length})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({completedPurchases.length})
					</TabsTrigger>
				</TabsList>

				{/* Active Purchases */}
				<TabsContent value="active" className="space-y-4">
					{activePurchases.length > 0 ? (
						activePurchases.map((purchase) => (
							<Card key={purchase.id}>
								<CardContent className="pt-6">
									<div className="flex flex-col lg:flex-row gap-6">
										{/* Product Image */}
										{purchase.productImage && (
											<img
												src={purchase.productImage}
												alt={purchase.productName}
												className="h-24 w-24 rounded-lg object-cover"
											/>
										)}

										{/* Details */}
										<div className="flex-1 space-y-4">
											<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
												<div>
													<h3 className="font-semibold text-lg">
														{purchase.productName}
													</h3>
													<p className="text-sm text-muted-foreground">
														{purchase.supplierName}
													</p>
												</div>
												<Badge className={getStatusColor(purchase.status)}>
													{purchase.status}
												</Badge>
											</div>

											{/* Progress */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Payment Progress
													</span>
													<span className="font-medium">
														{purchase.installmentsPaid} of{" "}
														{purchase.totalInstallments} payments
													</span>
												</div>
												<Progress
													value={
														(purchase.installmentsPaid /
															purchase.totalInstallments) *
														100
													}
													className="h-2"
												/>
											</div>

											{/* Stats */}
											<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
												<div>
													<p className="text-muted-foreground">Monthly</p>
													<p className="font-medium">
														${purchase.monthlyPayment.toFixed(2)}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground">Paid</p>
													<p className="font-medium text-green-600">
														${purchase.paidAmount.toLocaleString()}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground">
														Remaining
													</p>
													<p className="font-medium">
														${purchase.remainingAmount.toLocaleString()}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground">
														Next Payment
													</p>
													<p className="font-medium">
														{purchase.nextPaymentDate}
													</p>
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="flex lg:flex-col gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleViewDetails(purchase)}>
												<Eye className="mr-2 h-4 w-4" />
												Details
											</Button>
											<Button variant="outline" size="sm" disabled>
												<Download className="mr-2 h-4 w-4" />
												Contract
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<Card className="py-12">
							<CardContent className="text-center">
								<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="font-semibold text-lg mb-2">No active purchases</h3>
								<p className="text-muted-foreground">
									Browse the catalog to find products
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				{/* Pending Orders */}
				<TabsContent value="pending">
					<Card>
						<CardHeader>
							<CardTitle>Pending Orders</CardTitle>
							<CardDescription>Orders awaiting approval or delivery</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead>Order Date</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pendingOrders.map((order) => (
										<TableRow key={order.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													{order.productImage && (
														<img
															src={order.productImage}
															alt={order.productName}
															className="h-10 w-10 rounded-md object-cover"
														/>
													)}
													<div>
														<p className="font-medium">
															{order.productName}
														</p>
														<p className="text-xs text-muted-foreground">
															{order.supplierName}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>{order.orderDate}</TableCell>
											<TableCell>${order.amount.toLocaleString()}</TableCell>
											<TableCell>
												<Badge className={getStatusColor(order.status)}>
													{order.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleViewDetails(order)}>
													<Eye className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Completed Purchases */}
				<TabsContent value="completed">
					<Card>
						<CardHeader>
							<CardTitle>Completed Purchases</CardTitle>
							<CardDescription>Fully paid EPP purchases</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Product</TableHead>
										<TableHead>supplier</TableHead>
										<TableHead>Total Paid</TableHead>
										<TableHead>Completed</TableHead>
										<TableHead className="text-right">Documents</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{completedPurchases.map((purchase) => (
										<TableRow key={purchase.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													{purchase.productImage && (
														<img
															src={purchase.productImage}
															alt={purchase.productName}
															className="h-10 w-10 rounded-md object-cover"
														/>
													)}
													<span className="font-medium">
														{purchase.productName}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{purchase.supplierName}
											</TableCell>
											<TableCell>
												${purchase.totalAmount.toLocaleString()}
											</TableCell>
											<TableCell>
												<Badge variant="secondary">
													{purchase.totalInstallments} payments
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" disabled>
													<FileText className="mr-2 h-4 w-4" />
													Invoice
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Order Detail Dialog */}
			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Order Details</DialogTitle>
						<DialogDescription>Full details of your purchase</DialogDescription>
					</DialogHeader>
					{selectedOrder && (
						<div className="space-y-4">
							<div className="flex gap-4">
								{"productImage" in selectedOrder && selectedOrder.productImage && (
									<img
										src={selectedOrder.productImage}
										alt={selectedOrder.productName}
										className="h-20 w-20 rounded-lg object-cover"
									/>
								)}
								<div>
									<h3 className="font-semibold">{selectedOrder.productName}</h3>
									<p className="text-sm text-muted-foreground">
										{"supplierName" in selectedOrder
											? selectedOrder.supplierName
											: ""}
									</p>
								</div>
							</div>

							<div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
								{"totalAmount" in selectedOrder ? (
									<>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Total Amount
											</span>
											<span>
												${selectedOrder.totalAmount.toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Monthly Payment
											</span>
											<span>${selectedOrder.monthlyPayment.toFixed(2)}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Progress</span>
											<span>
												{selectedOrder.installmentsPaid}/
												{selectedOrder.totalInstallments} payments
											</span>
										</div>
									</>
								) : (
									<>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Amount</span>
											<span>${selectedOrder.amount.toLocaleString()}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Order Date
											</span>
											<span>{selectedOrder.orderDate}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Status</span>
											<Badge className={getStatusColor(selectedOrder.status)}>
												{selectedOrder.status}
											</Badge>
										</div>
									</>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

