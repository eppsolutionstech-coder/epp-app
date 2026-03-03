import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrderTimelineSteps, type OrderTimelineStep } from "~/lib/order-utils";
import type { OrderWithRelation } from "~/zod/order.zod";

interface OrderTimelineProps {
	order: OrderWithRelation;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
	const formatDate = (value?: Date | string | null) => {
		if (!value) {
			return undefined;
		}
		const parsedDate = new Date(value);
		if (Number.isNaN(parsedDate.getTime())) {
			return undefined;
		}
		return parsedDate.toLocaleDateString();
	};

	const timelineSteps = getOrderTimelineSteps(order);

	const TimelineItem = ({
		title,
		date,
		description,
		isActive,
		isCompleted,
		tone = "default",
	}: OrderTimelineStep) => (
		<div className="relative pl-6 pb-6 last:pb-0 group">
			{/* Line */}
			<div className="absolute left-[9px] top-3 h-full w-0.5 bg-muted group-last:hidden" />

			{/* Dot */}
			<div
				className={cn(
					"absolute left-0 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors z-10",
					isCompleted
						? tone === "danger"
							? "bg-red-600 border-red-600 text-white"
							: tone === "warning"
								? "bg-orange-500 border-orange-500 text-white"
								: "bg-primary border-primary text-primary-foreground"
						: isActive
							? tone === "danger"
								? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
								: tone === "warning"
									? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
									: "border-primary bg-background text-primary"
							: "border-muted bg-muted text-muted-foreground",
				)}>
				{isCompleted ? (
					<CheckCircle className="h-3 w-3" />
				) : (
					<div className="h-1.5 w-1.5 rounded-full bg-current" />
				)}
			</div>

			<div className="space-y-1">
				<p
					className={cn(
						"text-sm font-medium leading-none",
						isActive &&
							(tone === "danger"
								? "text-red-700 dark:text-red-300"
								: tone === "warning"
									? "text-orange-700 dark:text-orange-300"
									: "text-primary"),
					)}>
					{title}
				</p>
				{date && <p className="text-xs text-muted-foreground">{formatDate(date)}</p>}
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
					{timelineSteps.map(({ key, ...step }) => (
						<TimelineItem key={key} {...step} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
