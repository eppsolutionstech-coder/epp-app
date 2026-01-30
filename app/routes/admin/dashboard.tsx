import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "~/components/stat-card";
import { MOCK_STATS, MOCK_REQUESTS } from "~/data/mock-admin-data";
import {
	DollarSign,
	Users,
	ShoppingCart,
	Clock,
	ArrowUpRight,
	Activity,
	FileText,
	ShieldCheck,
	Settings,
} from "lucide-react";

export default function AdminDashboard() {
	const stats = [
		{
			title: "Total Outstanding",
			value: `₱${MOCK_STATS.totalOutstanding.toLocaleString()}`,
			description: "12.5% vs last month",
			trend: "up" as const,
			icon: DollarSign,
			color: "text-chart-1",
			bg: "bg-chart-1/10",
			border: "border-chart-1/20",
		},
		{
			title: "Active Users",
			value: MOCK_STATS.activeUsers,
			description: "+4 new this week",
			trend: "up" as const,
			icon: Users,
			color: "text-chart-2",
			bg: "bg-chart-2/10",
			border: "border-chart-2/20",
		},
		{
			title: "Monthly Volume",
			value: `₱${MOCK_STATS.monthlyVolume.toLocaleString()}`,
			description: "8.2% vs last month",
			trend: "up" as const,
			icon: ShoppingCart,
			color: "text-chart-3",
			bg: "bg-chart-3/10",
			border: "border-chart-3/20",
		},
		{
			title: "Pending Approvals",
			value: MOCK_STATS.pendingApprovals,
			description: "Requires attention",
			trend: "neutral" as const,
			icon: Clock,
			color: "text-chart-4",
			bg: "bg-chart-4/10",
			border: "border-chart-4/20",
		},
	];

	const quickActions = [
		{ name: "Review Pending", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
		{
			name: "Monthly Report",
			icon: Activity,
			color: "text-purple-500",
			bg: "bg-purple-500/10",
		},
		{ name: "User Limits", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
		{ name: "Program Rules", icon: Settings, color: "text-orange-500", bg: "bg-orange-500/10" },
	];

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col space-y-2">
				<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
					Dashboard Overview
				</h1>
				<p className="text-muted-foreground text-lg max-w-2xl">
					Welcome back. Here's an overview of your program's performance and recent
					activity.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<StatCard key={stat.title} {...stat} />
				))}
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4 shadow-md border-border/50">
					<CardHeader>
						<CardTitle className="text-xl">Recent Activity</CardTitle>
						<CardDescription>
							Latest purchase requests and system updates
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{MOCK_REQUESTS.slice(0, 5).map((req, index) => (
								<div
									key={req.id}
									className="flex items-center justify-between group">
									<div className="flex items-center gap-4">
										<Avatar className="h-10 w-10 border-2 border-background ring-2 ring-muted transition-transform group-hover:scale-105">
											<AvatarImage
												src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.employeeName}`}
												alt={req.employeeName}
											/>
											<AvatarFallback>
												{req.employeeName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
												{req.employeeName}
											</p>
											<p className="text-xs text-muted-foreground">
												Requested{" "}
												<span className="font-medium text-foreground">
													{req.productName}
												</span>
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="text-right hidden sm:block">
											<p className="text-sm font-medium">
												₱{req.amount.toLocaleString()}
											</p>
											<p className="text-xs text-muted-foreground">
												{req.date}
											</p>
										</div>
										<Badge
											variant={
												req.status === "approved"
													? "default"
													: req.status === "rejected"
														? "destructive"
														: "secondary"
											}
											className={`capitalize ${
												req.status === "approved"
													? "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20"
													: req.status === "pending"
														? "bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20"
														: ""
											} shadow-none`}>
											{req.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter className="border-t bg-muted/20 p-4 pb-0">
						<Button
							variant="ghost"
							className="w-full text-xs text-muted-foreground hover:text-primary">
							View all activity <ArrowUpRight className="ml-2 h-3 w-3" />
						</Button>
					</CardFooter>
				</Card>

				<div className="col-span-3 space-y-6">
					<Card className="shadow-md border-border/50 h-full">
						<CardHeader>
							<CardTitle className="text-xl">Quick Actions</CardTitle>
							<CardDescription>Common management tasks</CardDescription>
						</CardHeader>
						<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{quickActions.map((action, i) => (
								<Button
									key={i}
									variant="outline"
									className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
									<div className={`p-2 rounded-full ${action.bg}`}>
										<action.icon className={`h-5 w-5 ${action.color}`} />
									</div>
									<span className="text-xs font-medium">{action.name}</span>
								</Button>
							))}
						</CardContent>
						<CardFooter className="pt-0">
							<Card className="w-full bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border-none shadow-lg mt-4">
								<CardContent className="p-4 flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-sm font-medium alpha-90">
											Budget Status
										</p>
										<p className="text-2xl font-bold">82%</p>
										<p className="text-xs alpha-75">utilized this month</p>
									</div>
									<div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
										<Activity className="h-6 w-6" />
									</div>
								</CardContent>
							</Card>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
