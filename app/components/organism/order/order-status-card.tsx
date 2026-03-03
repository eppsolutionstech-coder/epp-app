import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	getOrderStatusBadgeClass,
	getOrderStatusLabel,
	getOrderStatusMessage,
	getOrderStatusSurfaceClass,
} from "~/lib/order-utils";
import type { OrderWithRelation } from "~/zod/order.zod";

interface OrderStatusCardProps {
	order: OrderWithRelation;
}

export function OrderStatusCard({ order }: OrderStatusCardProps) {
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
							getOrderStatusSurfaceClass(order.status),
						)}>
						<div className="flex flex-col gap-2">
							<Badge
								className={cn(
									"w-fit text-sm py-0.5 px-3 h-auto shadow-none",
									getOrderStatusBadgeClass(order.status),
									"border-none text-white",
								)}>
								{getOrderStatusLabel(order.status)}
							</Badge>
							<p className="text-xs text-muted-foreground leading-tight">
								{getOrderStatusMessage(order.status)}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
