import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	MOCK_PRODUCTS,
	MOCK_suppliers,
	MOCK_ORDERS,
	PRODUCT_CATEGORIES,
} from "~/data/mock-admin-data";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download, Filter } from "lucide-react";
import { useState } from "react";

export default function AdminReportsPage() {
	const [dateRange, setDateRange] = useState("30");
	const [categoryFilter, setCategoryFilter] = useState("all");

	// Calculate stats
	const totalProducts = MOCK_PRODUCTS.length;
	const activeProducts = MOCK_PRODUCTS.filter((p) => p.status === "active").length;
	const totalsuppliers = MOCK_suppliers.filter((v) => v.status === "active").length;
	const totalOrders = MOCK_ORDERS.length;
	const totalRevenue = MOCK_ORDERS.filter((o) => o.status === "delivered").reduce(
		(sum, o) => sum + o.amount,
		0,
	);
	const pendingOrders = MOCK_ORDERS.filter((o) => o.status === "pending").length;

	// Category distribution
	const categoryStats = PRODUCT_CATEGORIES.map((cat) => ({
		category: cat,
		count: MOCK_PRODUCTS.filter((p) => p.category === cat).length,
		revenue: MOCK_ORDERS.filter((o) => {
			const product = MOCK_PRODUCTS.find((p) => p.id === o.productId);
			return product?.category === cat;
		}).reduce((sum, o) => sum + o.amount, 0),
	}));

	// supplier performance
	const supplierstats = MOCK_suppliers.filter((v) => v.status === "active")
		.map((supplier) => ({
			...supplier,
			orders: MOCK_ORDERS.filter((o) => o.supplierId === supplier.id).length,
			revenue: MOCK_ORDERS.filter(
				(o) => o.supplierId === supplier.id && o.status === "delivered",
			).reduce((sum, o) => sum + o.amount, 0),
		}))
		.sort((a, b) => b.revenue - a.revenue);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
					<p className="text-muted-foreground">
						Platform analytics and performance metrics.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={dateRange} onValueChange={setDateRange}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Date range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7">Last 7 days</SelectItem>
							<SelectItem value="30">Last 30 days</SelectItem>
							<SelectItem value="90">Last 90 days</SelectItem>
							<SelectItem value="365">Last year</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" disabled>
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</div>

			{/* Overview Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-500">+12.5%</span> from last period
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders}</div>
						<p className="text-xs text-muted-foreground">
							{pendingOrders} pending approval
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Products</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeProducts}</div>
						<p className="text-xs text-muted-foreground">
							of {totalProducts} total products
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active suppliers</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalsuppliers}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-500">+2</span> new this month
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Category Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Purchase Volume by Category</CardTitle>
						<CardDescription>
							Distribution of orders across product categories
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{categoryStats.map((stat) => {
							const maxRevenue = Math.max(...categoryStats.map((s) => s.revenue));
							const percentage =
								maxRevenue > 0 ? (stat.revenue / maxRevenue) * 100 : 0;

							return (
								<div key={stat.category} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<span className="font-medium">{stat.category}</span>
											<Badge variant="secondary" className="text-xs">
												{stat.count} products
											</Badge>
										</div>
										<span className="font-medium">
											${stat.revenue.toLocaleString()}
										</span>
									</div>
									<div className="h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-primary rounded-full transition-all"
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>

				{/* supplier Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Top suppliers by Revenue</CardTitle>
						<CardDescription>Performance ranking of active suppliers</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{supplierstats.slice(0, 5).map((supplier, index) => (
								<div key={supplier.id} className="flex items-center gap-4">
									<div className="flex-shrink-0 w-6 text-center">
										<span className="text-sm font-medium text-muted-foreground">
											#{index + 1}
										</span>
									</div>
									{supplier.logo && (
										<img
											src={supplier.logo}
											alt={supplier.name}
											className="h-10 w-10 rounded-lg object-cover"
										/>
									)}
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">{supplier.name}</p>
										<p className="text-xs text-muted-foreground">
											{supplier.orders} orders â€¢ {supplier.productsCount} products
										</p>
									</div>
									<div className="text-right">
										<p className="font-semibold">
											${supplier.revenue.toLocaleString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Order Status Distribution */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Order Status Overview</CardTitle>
						<CardDescription>
							Current status of all orders in the system
						</CardDescription>
					</div>
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="w-[140px]">
							<Filter className="mr-2 h-4 w-4" />
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{PRODUCT_CATEGORIES.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
						{[
							{ status: "pending", label: "Pending", color: "bg-yellow-500" },
							{ status: "approved", label: "Approved", color: "bg-emerald-500" },
							{ status: "processing", label: "Processing", color: "bg-purple-500" },
							{ status: "shipped", label: "Shipped", color: "bg-indigo-500" },
							{ status: "delivered", label: "Delivered", color: "bg-green-500" },
							{ status: "cancelled", label: "Cancelled", color: "bg-red-500" },
						].map((item) => {
							const count = MOCK_ORDERS.filter(
								(o) => o.status === item.status,
							).length;
							return (
								<div
									key={item.status}
									className="text-center p-4 rounded-lg bg-muted/50">
									<div className={`h-2 w-full ${item.color} rounded-full mb-3`} />
									<p className="text-2xl font-bold">{count}</p>
									<p className="text-xs text-muted-foreground">{item.label}</p>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Export Notice */}
			<Card className="bg-muted/30">
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Export Reports</p>
							<p className="text-sm text-muted-foreground">
								Download detailed reports in CSV or PDF format
							</p>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" disabled>
								<Download className="mr-2 h-4 w-4" />
								CSV
							</Button>
							<Button variant="outline" size="sm" disabled>
								<Download className="mr-2 h-4 w-4" />
								PDF
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

