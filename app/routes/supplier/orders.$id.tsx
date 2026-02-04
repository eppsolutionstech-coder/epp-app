import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useGetOrderById } from "~/hooks/use-order";

// Shared Components
import { OrderItemsList } from "@/components/organism/order/order-items-list";
import { CustomerDetailsCard } from "@/components/organism/order/customer-details-card";
import { PaymentDetailsCard } from "@/components/organism/order/payment-details-card";
import { OrderStatusCard } from "@/components/organism/order/order-status-card";
import { OrderActionsCard } from "@/components/organism/order/order-actions-card";
import { OrderTimeline } from "@/components/organism/order/order-timeline";

export default function supplierOrderDetailsPage() {
	const { id } = useParams();

	const { data: orderResponse, isLoading } = useGetOrderById(id!, {
		fields: "id, orderNumber, userId, status, orderDate, paymentType, paymentMethod, installmentMonths, installmentCount, installmentAmount, subtotal, tax, total, orderItems.id, orderItems.quantity, orderItems.unitPrice, orderItems.subtotal, orderItems.item.name, orderItems.item.sku, orderItems.item.images",
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
					<Link to="/supplier/orders">Back to Orders</Link>
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
					<Link to="/supplier/orders">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-3">
						Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
					</h1>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Calendar className="h-3.5 w-3.5" />
						<span>Placed on {new Date(order.orderDate).toLocaleDateString()}</span>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" className="gap-2 rounded-full h-9">
					<Printer className="h-4 w-4" />
					Print Slip
				</Button>
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
			<PageHeader />

			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* MAIN CONTENT - Left Side (8 cols) */}
				<div className="md:col-span-8 flex flex-col gap-6">
					<OrderItemsList items={orderItems} />
					<CustomerDetailsCard user={order.user} />
					<PaymentDetailsCard order={order} />
				</div>

				{/* RIGHT SIDEBAR (4 cols) */}
				<div className="md:col-span-4 flex flex-col gap-6">
					<div className="space-y-6">
						<OrderStatusCard order={order} getStatusColor={getStatusColor} />
						<OrderActionsCard order={order} onStatusUpdate={handleStatusUpdate} />
						<OrderTimeline order={order} />
					</div>
				</div>
			</div>
		</div>
	);
}

