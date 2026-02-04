import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
	order: any;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
	const TimelineItem = ({
		title,
		date,
		description,
		isActive,
		isCompleted,
	}: {
		title: string;
		date?: string;
		description: string;
		isActive?: boolean;
		isCompleted?: boolean;
	}) => (
		<div className="relative pl-6 pb-6 last:pb-0 group">
			{/* Line */}
			<div className="absolute left-[9px] top-3 h-full w-0.5 bg-muted group-last:hidden" />

			{/* Dot */}
			<div
				className={cn(
					"absolute left-0 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors z-10",
					isCompleted
						? "bg-primary border-primary text-primary-foreground"
						: isActive
							? "border-primary bg-background text-primary"
							: "border-muted bg-muted text-muted-foreground",
				)}>
				{isCompleted ? (
					<CheckCircle className="h-3 w-3" />
				) : (
					<div className="h-1.5 w-1.5 rounded-full bg-current" />
				)}
			</div>

			<div className="space-y-1">
				<p className={cn("text-sm font-medium leading-none", isActive && "text-primary")}>
					{title}
				</p>
				{date && <p className="text-xs text-muted-foreground">{date}</p>}
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50 flex-1">
			<CardHeader className="pb-4">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<Truck className="h-4 w-4" />
					Tracking
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="pt-2">
					<TimelineItem
						title="Order Placed"
						date={
							order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"
						}
						description="Customer placed the order."
						isCompleted={true}
					/>
					<TimelineItem
						title="Verified & Approved"
						description="Order approved by supplier."
						isCompleted={["APPROVED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(
							order.status,
						)}
						isActive={order.status === "PENDING_APPROVAL"}
					/>
					<TimelineItem
						title="Processing"
						description="Items are being packed."
						isCompleted={["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)}
						isActive={order.status === "APPROVED"}
					/>
					<TimelineItem
						title="Shipped"
						description="Package is on its way."
						isCompleted={["SHIPPED", "DELIVERED"].includes(order.status)}
						isActive={order.status === "PROCESSING"}
					/>
					<TimelineItem
						title="Delivered"
						description="Package received by customer."
						isCompleted={order.status === "DELIVERED"}
						isActive={order.status === "SHIPPED"}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

