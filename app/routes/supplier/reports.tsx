import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "~/components/stat-card";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Area,
	AreaChart,
	Pie,
	PieChart,
} from "recharts";
import { Download, DollarSign, ShoppingCart, Eye, TrendingUp } from "lucide-react";

// Mock Data
const revenueTrend = [
	{ name: "Jan", value: 12500 },
	{ name: "Feb", value: 18900 },
	{ name: "Mar", value: 15600 },
	{ name: "Apr", value: 23400 },
	{ name: "May", value: 28900 },
	{ name: "Jun", value: 22100 },
	{ name: "Jul", value: 34500 },
];

const salesByCategory = [
	{ name: "Electronics", value: 45, color: "var(--chart-1)" },
	{ name: "Accessories", value: 30, color: "var(--chart-2)" },
	{ name: "Wearables", value: 15, color: "var(--chart-3)" },
	{ name: "Home Tech", value: 10, color: "var(--chart-4)" },
];

const topProducts = [
	{ name: "Noise-Cancelling Headphones", value: 124 },
	{ name: "Smart Fitness Watch", value: 98 },
	{ name: "Wireless Earbuds", value: 86 },
	{ name: "4K Monitor 27inch", value: 72 },
	{ name: "Mechanical Keyboard", value: 65 },
];

const customerRetention = [
	{ name: "Jan", new: 400, returning: 240 },
	{ name: "Feb", new: 300, returning: 139 },
	{ name: "Mar", new: 200, returning: 980 },
	{ name: "Apr", new: 278, returning: 390 },
	{ name: "May", new: 189, returning: 480 },
	{ name: "Jun", new: 239, returning: 380 },
];

export default function supplierReportsPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
					<p className="text-muted-foreground">
						Detailed insights into your store's performance.
					</p>
				</div>
				<Button variant="outline" className="gap-2">
					<Download className="h-4 w-4" />
					Export Report
				</Button>
			</div>

			{/* KPI Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Revenue"
					value="₱124,500"
					description="+12.5% from last month"
					trend="up"
					icon={DollarSign}
					color="text-chart-1" // Primary blue
					bg="bg-chart-1/10"
					border="border-chart-1/20"
				/>
				<StatCard
					title="Total Orders"
					value="1,248"
					description="+4.3% from last month"
					trend="up"
					icon={ShoppingCart}
					color="text-chart-2" // Teal
					bg="bg-chart-2/10"
					border="border-chart-2/20"
				/>
				<StatCard
					title="Product Views"
					value="45.2k"
					description="0.8% variance"
					trend="neutral"
					icon={Eye}
					color="text-chart-3" // Lavender
					bg="bg-chart-3/10"
					border="border-chart-3/20"
				/>
				<StatCard
					title="Conversion Rate"
					value="3.2%"
					description="-1.2% from last month"
					trend="down"
					icon={TrendingUp} // Using TrendingUp logic-wise, but visual is down based on prop
					color="text-chart-5" // Pink/Red ish
					bg="bg-chart-5/10"
					border="border-chart-5/20"
				/>
			</div>

			{/* Charts Section */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				{/* Revenue Trend - Area Chart */}
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Revenue Trend</CardTitle>
						<CardDescription>Monthly revenue performance</CardDescription>
					</CardHeader>
					<CardContent className="pl-2">
						<ResponsiveContainer width="100%" height={350}>
							<AreaChart data={revenueTrend}>
								<defs>
									<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="5%"
											stopColor="var(--chart-1)"
											stopOpacity={0.3}
										/>
										<stop
											offset="95%"
											stopColor="var(--chart-1)"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="name"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={(value) => `₱${value / 1000}k`}
								/>
								<Tooltip
									formatter={(value: number) => [
										`₱${value.toLocaleString()}`,
										"Revenue",
									]}
									contentStyle={{ borderRadius: "8px" }}
								/>
								<Area
									type="monotone"
									dataKey="value"
									stroke="var(--chart-1)"
									fillOpacity={1}
									fill="url(#colorRevenue)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Sales by Category - Pie Chart */}
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Sales by Category</CardTitle>
						<CardDescription>Revenue distribution across categories</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[350px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={salesByCategory}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={100}
										paddingAngle={5}
										dataKey="value">
										{salesByCategory.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
									<Legend verticalAlign="bottom" height={36} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Top Products - Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Top Products</CardTitle>
						<CardDescription>Best selling items by volume</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
								<CartesianGrid
									strokeDasharray="3 3"
									horizontal={false}
									className="stroke-muted"
								/>
								<XAxis type="number" hide />
								<YAxis
									dataKey="name"
									type="category"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									width={140}
								/>
								<Tooltip cursor={{ fill: "transparent" }} />
								<Bar
									dataKey="value"
									fill="var(--chart-2)"
									radius={[0, 4, 4, 0]}
									barSize={20}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Customer Retention - Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Customer Retention</CardTitle>
						<CardDescription>New vs Returning Customers</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={customerRetention}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="name"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip />
								<Legend />
								<Bar
									dataKey="new"
									name="New Customers"
									fill="var(--chart-1)"
									radius={[4, 4, 0, 0]}
									stackId="a"
								/>
								<Bar
									dataKey="returning"
									name="Returning Customers"
									fill="var(--chart-3)"
									radius={[4, 4, 0, 0]}
									stackId="a"
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

