import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_suppliers } from "~/data/mock-admin-data";
import {
	Package,
	ShoppingCart,
	CheckCircle,
	Clock,
	TrendingUp,
	ArrowRight,
	DollarSign,
	AlertTriangle,
} from "lucide-react";
import { Link } from "react-router";
import { StatsCard } from "~/components/molecule/stats-card";

export default function supplierDashboard() {
	// Using TechWorld Electronics as the current supplier
	const currentsupplier = MOCK_suppliers[0];

	// Filter data for current supplier
	const supplierProducts = MOCK_PRODUCTS.filter((p) => p.supplierId === currentsupplier.id);
	const supplierOrders = MOCK_ORDERS.filter((o) => o.supplierId === currentsupplier.id);

	const activeProducts = supplierProducts.filter((p) => p.status === "active").length;
	const pendingProducts = supplierProducts.filter(
		(p) => p.status === "pending" || p.status === "draft",
	).length;
	const pendingOrders = supplierOrders.filter((o) =>
		["pending", "approved", "processing"].includes(o.status),
	).length;
	const lowStockItems = supplierProducts.filter((p) => p.stock < 10).length;
	const totalRevenue = supplierOrders
		.filter((o) => o.status === "delivered")
		.reduce((sum, o) => sum + o.amount, 0);

	const stats = [
		{
			title: "Active Products",
			value: activeProducts,
			description: `${pendingProducts} pending approval`,
			icon: Package,
			color: "text-blue-600",
			bgColor: "bg-blue-50 dark:bg-blue-950/50",
		},
		{
			title: "Pending Orders",
			value: pendingOrders,
			description: "Requires action",
			icon: Clock,
			color: "text-amber-600",
			bgColor: "bg-amber-50 dark:bg-amber-950/50",
		},
		{
			title: "Low Stock Alerts",
			value: lowStockItems,
			description: "Items need restocking",
			icon: AlertTriangle,
			color: "text-red-600",
			bgColor: "bg-red-50 dark:bg-red-950/50",
		},
		{
			title: "Total Sales",
			value: `â‚±${totalRevenue.toLocaleString()}`,
			description: "From delivered orders",
			icon: DollarSign,
			color: "text-purple-600",
			bgColor: "bg-purple-50 dark:bg-purple-950/50",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome, {currentsupplier.name}!
					</h1>
					<p className="text-muted-foreground">
						Here's an overview of your products and orders.
					</p>
				</div>
				<Button asChild>
					<Link to="/supplier/products">
						<Package className="mr-2 h-4 w-4" />
						Manage Products
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<StatsCard key={stat.title} {...stat} />
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Orders */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Recent Orders</CardTitle>
							<CardDescription>Latest orders from employees</CardDescription>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link to="/supplier/orders">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{supplierOrders.slice(0, 4).map((order) => (
							<div key={order.id} className="flex items-center gap-4">
								{order.productImage && (
									<img
										src={order.productImage}
										alt={order.productName}
										className="h-10 w-10 rounded-md object-cover"
									/>
								)}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">
										{order.productName}
									</p>
									<p className="text-xs text-muted-foreground">
										{order.employeeName} â€¢ â‚±{order.amount.toLocaleString()}
									</p>
								</div>
								<Badge className={getStatusColor(order.status)}>
									{order.status}
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Product Performance */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Top Products</CardTitle>
							<CardDescription>Your best performing listings</CardDescription>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link to="/supplier/products">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{supplierProducts
							.filter((p) => p.status === "active")
							.slice(0, 4)
							.map((product) => (
								<div key={product.id} className="flex items-center gap-4">
									{product.image && (
										<img
											src={product.image}
											alt={product.name}
											className="h-10 w-10 rounded-md object-cover"
										/>
									)}
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{product.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{product.category} â€¢ â‚±{product.price.toLocaleString()}
										</p>
									</div>
									<div className="flex items-center gap-1 text-sm text-muted-foreground">
										<Package className="h-4 w-4" />
										<span>{product.stock}</span>
									</div>
								</div>
							))}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common tasks and shortcuts</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ label: "Add New Product", icon: Package, href: "/supplier/products" },
						{ label: "View Pending Orders", icon: Clock, href: "/supplier/orders" },
						{ label: "Update Inventory", icon: ShoppingCart, href: "/supplier/products" },
						{ label: "View Analytics", icon: TrendingUp, href: "/supplier/dashboard" },
					].map((action) => (
						<Link
							key={action.label}
							to={action.href}
							className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
							<action.icon className="h-5 w-5 text-muted-foreground" />
							<span className="text-sm font-medium">{action.label}</span>
						</Link>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

