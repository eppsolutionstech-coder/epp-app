import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";
import type { Product } from "~/data/mock-admin-data";

interface VendorAnalyticsTabProps {
	products: Product[];
}


/**U001-1 */
export function VendorAnalyticsTab({ products }: VendorAnalyticsTabProps) {
	const totalProducts = products.length;
	const activeProducts = products.filter((p) => p.status === "active").length;
	const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
	const avgPrice =
		products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;

	const stats = [
		{
			title: "Total Products",
			value: totalProducts,
			icon: Package,
			color: "text-blue-600",
			bgColor: "bg-blue-50 dark:bg-blue-950/50",
		},
		{
			title: "Active Listings",
			value: activeProducts,
			icon: TrendingUp,
			color: "text-emerald-600",
			bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
		},
		{
			title: "Total Stock",
			value: totalStock,
			icon: ShoppingCart,
			color: "text-amber-600",
			bgColor: "bg-amber-50 dark:bg-amber-950/50",
		},
		{
			title: "Avg. Price",
			value: `$${avgPrice.toFixed(0)}`,
			icon: DollarSign,
			color: "text-purple-600",
			bgColor: "bg-purple-50 dark:bg-purple-950/50",
		},
	];

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Analytics</h2>
			<p className="text-muted-foreground">Overview of your store performance</p>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.title}>
							<CardContent className="">
								<div className="flex items-center gap-4">
									<div
										className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
										<Icon className={`h-6 w-6 ${stat.color}`} />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											{stat.title}
										</p>
										<p className="text-2xl font-bold">{stat.value}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Placeholder for charts */}
			<Card>
				<CardContent className="">
					<h3 className="font-semibold mb-4">Sales Overview</h3>
					<div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
						<p className="text-muted-foreground">Chart placeholder</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
