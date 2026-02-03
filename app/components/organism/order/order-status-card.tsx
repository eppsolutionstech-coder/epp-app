import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusCardProps {
	order: any;
	getStatusColor: (status: string) => string;
}

export function OrderStatusCard({ order, getStatusColor }: OrderStatusCardProps) {
	const isPending = order.status === "PENDING_APPROVAL";
	const isApproved = order.status === "APPROVED";
	const isProcessing = order.status === "PROCESSING";
	const isShipped = order.status === "SHIPPED";
	const isDelivered = order.status === "DELIVERED";

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-semibold">Order Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
						Order ID
					</p>
					<p className="text-lg font-bold font-mono text-foreground">
						#{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
					</p>
				</div>

				<div className="space-y-1">
					<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
						Date Placed
					</p>
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium text-foreground">
							{order.orderDate
								? new Date(order.orderDate).toLocaleDateString()
								: "N/A"}
						</span>
					</div>
				</div>

				<Separator className="bg-border/50" />

				<div className="space-y-2">
					<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
						Current Status
					</p>
					<div
						className={cn(
							"rounded-lg p-4 border",
							isPending
								? "bg-yellow-50/50 border-yellow-200 dark:border-yellow-900/30 dark:bg-yellow-900/10"
								: isApproved
									? "bg-emerald-50/50 border-emerald-200 dark:border-emerald-900/30 dark:bg-emerald-900/10"
									: isProcessing
										? "bg-purple-50/50 border-purple-200 dark:border-purple-900/30 dark:bg-purple-900/10"
										: isShipped
											? "bg-indigo-50/50 border-indigo-200 dark:border-indigo-900/30 dark:bg-indigo-900/10"
											: isDelivered
												? "bg-green-50/50 border-green-200 dark:border-green-900/30 dark:bg-green-900/10"
												: "bg-muted/50 border-border",
						)}>
						<div className="flex flex-col gap-2">
							<Badge
								className={cn(
									"w-fit text-sm py-0.5 px-3 h-auto shadow-none",
									getStatusColor(order.status || ""),
									"border-none text-white",
								)}>
								{order.status?.replace("_", " ") || "Unknown Status"}
							</Badge>
							{isPending && (
								<p className="text-xs text-muted-foreground leading-tight">
									This order requires your approval before processing.
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
