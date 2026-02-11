import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetOrderById } from "~/hooks/use-order";

// New Component Imports
import { OrderItemsList } from "@/components/organism/order/order-items-list";
import { CustomerDetailsCard } from "@/components/organism/order/customer-details-card";
import { PaymentDetailsCard } from "@/components/organism/order/payment-details-card";
import { OrderStatusCard } from "@/components/organism/order/order-status-card";
import { OrderApprovalsCard } from "@/components/organism/order/order-approvals-card";
import { OrderTimeline } from "@/components/organism/order/order-timeline";
import { PurchaseOrderModal } from "@/components/organism/order/purchase-order-modal";

export default function AdminOrderDetailsPage() {
	const { id } = useParams();
	const [isPOModalOpen, setIsPOModalOpen] = useState(false);

	// Cast to any to handle relations not in the base Zod schema
	const { data: orderResponse, isLoading } = useGetOrderById(id!, {
		fields: "id, orderNumber, userId, status, orderDate, paymentType, paymentMethod, installmentMonths, installmentCount, installmentAmount, subtotal, tax, total, orderItems.id, orderItems.quantity, orderItems.unitPrice, orderItems.subtotal, orderItems.item.name, orderItems.item.sku, orderItems.item.images, approvals.id, approvals.approvalLevel, approvals.approverRole, approvals.approverId, approvals.approverName, approvals.approverEmail, approvals.status, purchaseOrders",
	});

	const order = orderResponse as any;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING_APPROVAL":
				return "bg-yellow-500 hover:bg-yellow-600";
			case "APPROVED":
				return "bg-emerald-500 hover:bg-emerald-600";
			case "PROCESSING":
				return "bg-purple-500 hover:bg-purple-600";
			case "SHIPPED":
				return "bg-indigo-500 hover:bg-indigo-600";
			case "DELIVERED":
				return "bg-green-500 hover:bg-green-600";
			case "CANCELLED":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-gray-500 hover:bg-gray-600";
		}
	};

	const handleStatusUpdate = (newStatus: string) => {
		// In a real app, this would be a mutation
		toast.success(`Order marked as ${newStatus}`);
	};

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center py-12 gap-4">
				<h1 className="text-2xl font-bold">Order Not Found</h1>
				<p className="text-muted-foreground">
					The order you are looking for does not exist.
				</p>
				<Button asChild>
					<Link to="/admin/orders">Back to Orders</Link>
				</Button>
			</div>
		);
	}

	const orderItems = order.orderItems || [];

	// Header Component
	const PageHeader = () => (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					asChild
					className="h-10 w-10 rounded-full hover:bg-muted/50 transition-colors">
					<Link to="/admin/orders">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Order Details</h1>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{order.purchaseOrders?.length > 0 ? (
					<Button
						variant="outline"
						className="gap-2 rounded-full h-9"
						onClick={() => setIsPOModalOpen(true)}>
						<FileText className="h-4 w-4" />
						View Purchase Order
					</Button>
				) : (
					<Button asChild variant="outline" className="gap-2 rounded-full h-9">
						<Link to={`/admin/orders/${id}/create-po`}>
							<FileText className="h-4 w-4" />
							Create Purchase Order
						</Link>
					</Button>
				)}
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<PageHeader />
			<PurchaseOrderModal open={isPOModalOpen} onOpenChange={setIsPOModalOpen} />

			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				{/* MAIN CONTENT - Left Side (8 cols) */}
				<div className="md:col-span-8 flex flex-col gap-4">
					<OrderItemsList items={orderItems} />
					<CustomerDetailsCard user={order.user} />
					<PaymentDetailsCard order={order} />
				</div>

				{/* RIGHT SIDEBAR (4 cols) */}
				<div className="md:col-span-4 flex flex-col gap-4">
					<div className="space-y-4">
						<OrderStatusCard order={order} getStatusColor={getStatusColor} />
						<OrderApprovalsCard approvals={order.approvals} />
						<OrderTimeline order={order} />
					</div>
				</div>
			</div>
		</div>
	);
}
