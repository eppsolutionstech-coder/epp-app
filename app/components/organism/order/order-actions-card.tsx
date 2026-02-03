import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, XCircle, FileText, Truck } from "lucide-react";
import { toast } from "sonner";

interface OrderActionsCardProps {
	order: any;
	onStatusUpdate: (status: string) => void;
}

export function OrderActionsCard({ order, onStatusUpdate }: OrderActionsCardProps) {
	const isPending = order.status === "PENDING_APPROVAL";
	const isApproved = order.status === "APPROVED";
	const isProcessing = order.status === "PROCESSING";
	const isShipped = order.status === "SHIPPED";
	const isDelivered = order.status === "DELIVERED";
	const isCancelled = order.status === "CANCELLED";

	if (isCancelled || isDelivered) return null;

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<Package className="h-4 w-4 text-primary" />
					Actions
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{isPending && (
					<>
						<Button
							onClick={() => onStatusUpdate("APPROVED")}
							className="w-full justify-start gap-3 h-10 shadow-sm"
							variant="default">
							<CheckCircle className="h-4 w-4" />
							Approve Order
						</Button>
						<Button
							variant="outline"
							onClick={() => onStatusUpdate("CANCELLED")}
							className="w-full justify-start gap-3 h-10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
							<XCircle className="h-4 w-4" />
							Decline Order
						</Button>
					</>
				)}
				{isApproved && (
					<>
						<Button
							onClick={() => {
								toast.success("PO Created successfully!");
								// Setup navigation or logic for PO creation here
							}}
							className="w-full justify-start gap-3"
							variant="default">
							<FileText className="h-4 w-4" />
							Create PO
						</Button>
						<Button
							onClick={() => onStatusUpdate("PROCESSING")}
							className="w-full justify-start gap-3"
							variant="secondary">
							<Package className="h-4 w-4" />
							Start Processing
						</Button>
					</>
				)}
				{isProcessing && (
					<Button
						onClick={() => onStatusUpdate("SHIPPED")}
						className="w-full justify-start gap-3">
						<Truck className="h-4 w-4" />
						Mark as Shipped
					</Button>
				)}
				{isShipped && (
					<Button
						onClick={() => onStatusUpdate("DELIVERED")}
						className="w-full justify-start gap-3"
						variant="default">
						<CheckCircle className="h-4 w-4" />
						Mark as Delivered
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
