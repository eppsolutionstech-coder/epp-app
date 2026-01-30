import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_STATS, MOCK_REQUESTS } from "~/data/mock-admin-data";
import { DollarSign, Users, ShoppingCart, Clock, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
	const stats = [
		{
			title: "Total Outstanding",
			value: `$${MOCK_STATS.totalOutstanding.toLocaleString()}`,
			description: "+12.5% from last month",
			icon: DollarSign,
		},
		{
			title: "Active Users",
			value: MOCK_STATS.activeUsers,
			description: "+4 new this week",
			icon: Users,
		},
		{
			title: "Monthly Volume",
			value: `$${MOCK_STATS.monthlyVolume.toLocaleString()}`,
			description: "+8.2% from last month",
			icon: ShoppingCart,
		},
		{
			title: "Pending Approvals",
			value: MOCK_STATS.pendingApprovals,
			description: "Requires attention",
			icon: Clock,
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your program's performance and activity.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">{stat.description}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Recent purchase requests and system events.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							{MOCK_REQUESTS.slice(0, 5).map((req) => (
								<div key={req.id} className="flex items-center">
									<div className="space-y-1">
										<p className="text-sm font-medium leading-none">
											{req.employeeName} requested {req.productName}
										</p>
										<p className="text-sm text-muted-foreground">
											{req.date} • ${req.amount.toLocaleString()}
										</p>
									</div>
									<div
										className={`ml-auto font-medium ${
											req.status === "approved"
												? "text-green-500"
												: req.status === "rejected"
													? "text-red-500"
													: "text-yellow-500"
										}`}>
										{req.status.charAt(0).toUpperCase() + req.status.slice(1)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common tasks and reports.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-2">
						{[
							"Review Pending Approvals",
							"Generate Monthly Report",
							"Manage Employee Limits",
							"Update Program Rules",
						].map((action, i) => (
							<div
								key={i}
								className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
								<span className="text-sm font-medium">{action}</span>
								<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
