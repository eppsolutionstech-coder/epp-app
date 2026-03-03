import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useGetOrderById } from "~/hooks/use-order";

import { OrderItemsList } from "@/components/organism/order/order-items-list";
import { CustomerDetailsCard } from "@/components/organism/order/customer-details-card";
import { PaymentDetailsCard } from "@/components/organism/order/payment-details-card";
import { OrderStatusCard } from "@/components/organism/order/order-status-card";
import { OrderApprovalsCard } from "@/components/organism/order/order-approvals-card";
import { OrderTimeline } from "@/components/organism/order/order-timeline";
import { PurchaseOrderModal } from "@/components/organism/order/purchase-order-modal";

const ORDER_DETAIL_FIELDS = [
	"id",
	"orderNumber",
	"userId",
	"status",
	"orderDate",
	"approvedAt",
	"rejectedAt",
	"cancelledDate",
	"shippedDate",
	"deliveredDate",
	"updatedAt",
	"paymentType",
	"paymentMethod",
	"installmentMonths",
	"installmentCount",
	"installmentAmount",
	"subtotal",
	"tax",
	"total",
	"orderItems.id",
	"orderItems.quantity",
	"orderItems.unitPrice",
	"orderItems.subtotal",
	"orderItems.item.supplier.name",
	"orderItems.item.name",
	"orderItems.item.sku",
	"orderItems.item.images",
	"approvals.id",
	"approvals.approvalLevel",
	"approvals.approverRole",
	"approvals.approverId",
	"approvals.approverName",
	"approvals.approverEmail",
	"approvals.status",
	"purchaseOrders.id",
].join(",");

export default function AdminOrderDetailsPage() {
	const { id } = useParams();
	const [isPOModalOpen, setIsPOModalOpen] = useState(false);

	const { data: order, isLoading } = useGetOrderById(id ?? "", {
		fields: ORDER_DETAIL_FIELDS,
	});

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

	const orderItems = order.orderItems ?? [];

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
				{order.purchaseOrders?.length ? (
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
			<PurchaseOrderModal
				open={isPOModalOpen}
				onOpenChange={setIsPOModalOpen}
				purchaseOrderId={order.purchaseOrders?.[0]?.id}
			/>

			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				<div className="md:col-span-8 flex flex-col gap-4">
					<OrderItemsList items={orderItems} />
					<CustomerDetailsCard user={order.user} />
					<PaymentDetailsCard order={order} />
				</div>

				<div className="md:col-span-4 flex flex-col gap-4">
					<div className="space-y-4">
						<OrderStatusCard order={order} />
						<OrderApprovalsCard approvals={order.approvals ?? []} />
						<OrderTimeline order={order} />
					</div>
				</div>
			</div>
		</div>
	);
}
