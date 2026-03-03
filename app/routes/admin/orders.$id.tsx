import { useState, type FormEvent } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ClipboardCheck, FileText, Loader2, Truck } from "lucide-react";
import { useGetOrderById } from "~/hooks/use-order";
import {
	useCreateDOToClient,
	useCreateDRFromSupplier,
} from "~/hooks/use-delivery-document";
import { toast } from "sonner";

import { OrderItemsList } from "@/components/organism/order/order-items-list";
import { CustomerDetailsCard } from "@/components/organism/order/customer-details-card";
import { PaymentDetailsCard } from "@/components/organism/order/payment-details-card";
import { OrderStatusCard } from "@/components/organism/order/order-status-card";
import { OrderApprovalsCard } from "@/components/organism/order/order-approvals-card";
import { OrderTimeline } from "@/components/organism/order/order-timeline";
import { DeliveryOrderModal } from "@/components/organism/order/delivery-order-modal";
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
	"purchaseOrders.deliveryDocuments.id",
	"purchaseOrders.deliveryDocuments.documentType",
	"purchaseOrders.deliveryDocuments.transferStage",
	"deliveryDocuments.id",
	"deliveryDocuments.documentType",
	"deliveryDocuments.transferStage",
].join(",");

export default function AdminOrderDetailsPage() {
	const { id: orderId } = useParams();
	const [isPOModalOpen, setIsPOModalOpen] = useState(false);
	const [isDRModalOpen, setIsDRModalOpen] = useState(false);
	const [isDOModalOpen, setIsDOModalOpen] = useState(false);
	const [drForm, setDrForm] = useState({
		receiverName: "",
		receiverSignature: "",
		conditionOfGoods: "",
	});

	const { data: order, isLoading } = useGetOrderById(orderId ?? "", {
		fields: ORDER_DETAIL_FIELDS,
	});
	const { mutate: createDRFromSupplier, isPending: isCreatingDRFromSupplier } =
		useCreateDRFromSupplier();
	const { mutate: createDOToClient, isPending: isCreatingDOToClient } = useCreateDOToClient();

	const resetDRForm = () => {
		setDrForm({
			receiverName: "",
			receiverSignature: "",
			conditionOfGoods: "",
		});
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

	const orderItems = order.orderItems ?? [];
	const supplierDeliveryDocuments = order.purchaseOrders?.[0]?.deliveryDocuments ?? [];

	const supplierDOId = supplierDeliveryDocuments.find(
		(doc) =>
			doc.documentType === "DELIVERY_ORDER" && doc.transferStage === "VENDOR_TO_ADMIN",
	)?.id;
	const supplierDRId = supplierDeliveryDocuments.find(
		(doc) =>
			doc.documentType === "DELIVERY_RECEIPT" && doc.transferStage === "VENDOR_TO_ADMIN",
	)?.id;
	const adminDOId = order.deliveryDocuments?.find(
		(doc) =>
			doc.documentType === "DELIVERY_ORDER" && doc.transferStage === "ADMIN_TO_CLIENT",
	)?.id;

	const canCreateDRFromSupplier = !!supplierDOId && !supplierDRId;
	const canCreateDOToClient =
		order.status === "PROCESSING" && !!supplierDRId && !adminDOId;

	const handleDRModalChange = (open: boolean) => {
		if (!open) {
			resetDRForm();
		}
		setIsDRModalOpen(open);
	};

	const handleCreateDRFromSupplier = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!supplierDOId) {
			toast.error("Supplier delivery order is missing for this order.");
			return;
		}

		const receiverName = drForm.receiverName.trim();
		const receiverSignature = drForm.receiverSignature.trim();
		const conditionOfGoods = drForm.conditionOfGoods.trim();

		if (!receiverName || !receiverSignature || !conditionOfGoods) {
			toast.error("All delivery receipt fields are required.");
			return;
		}

		createDRFromSupplier(
			{
				doId: supplierDOId,
				data: {
					receiverName,
					receiverSignature,
					conditionOfGoods,
				},
			},
			{
				onSuccess: () => {
					toast.success("Supplier delivery receipt created successfully.");
					handleDRModalChange(false);
				},
				onError: (error) => {
					toast.error(`Failed to create supplier delivery receipt: ${error.message}`);
				},
			},
		);
	};

	const handleCreateDOToClient = () => {
		createDOToClient(
			{
				orderId: order.id,
			},
			{
				onSuccess: () => {
					toast.success("Delivery order to client created successfully.");
				},
				onError: (error) => {
					toast.error(`Failed to create delivery order to client: ${error.message}`);
				},
			},
		);
	};

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
			<div className="flex items-center gap-2 flex-wrap">
				{order.purchaseOrders?.length ? (
					<Button
						variant="outline"
						className="gap-2 rounded-full h-9 border-border/60 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
						onClick={() => setIsPOModalOpen(true)}>
						<FileText className="h-4 w-4" />
						View Purchase Order
					</Button>
				) : (
					<Button
						asChild
						variant="outline"
						className="gap-2 rounded-full h-9 border-border/60 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
						<Link to={`/admin/orders/${orderId}/create-po`}>
							<FileText className="h-4 w-4" />
							Create Purchase Order
						</Link>
					</Button>
				)}
				{canCreateDRFromSupplier && (
					<Button
						className="gap-2 rounded-full h-9 border border-chart-4/30 bg-chart-4/10 text-chart-4 hover:bg-chart-4/20 hover:border-chart-4/50 shadow-sm transition-all duration-300"
						onClick={() => setIsDRModalOpen(true)}
						disabled={isCreatingDRFromSupplier}>
						{isCreatingDRFromSupplier ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ClipboardCheck className="h-4 w-4" />
						)}
						Create DR (Supplier)
					</Button>
				)}
				{canCreateDOToClient && (
					<Button
						className="gap-2 rounded-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300"
						onClick={handleCreateDOToClient}
						disabled={isCreatingDOToClient}>
						{isCreatingDOToClient ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Truck className="h-4 w-4" />
						)}
						Create DO (Client)
					</Button>
				)}
				{adminDOId && (
					<Button
						variant="outline"
						className="gap-2 rounded-full h-9 border-border/60 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
						onClick={() => setIsDOModalOpen(true)}>
						<FileText className="h-4 w-4" />
						View Delivery Order
					</Button>
				)}
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			<PageHeader />
			<Dialog open={isDRModalOpen} onOpenChange={handleDRModalChange}>
				<DialogContent className="sm:max-w-lg border-border/60 shadow-md">
					<DialogHeader className="space-y-3">
						<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-chart-4/10 text-chart-4">
							<ClipboardCheck className="h-5 w-5" />
						</div>
						<div className="space-y-1">
							<DialogTitle>Create Delivery Receipt From Supplier</DialogTitle>
							<DialogDescription>
								Provide receiver details before creating the supplier delivery
								receipt.
							</DialogDescription>
						</div>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleCreateDRFromSupplier}>
						<div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
							<Label htmlFor="receiverName" className="text-foreground font-medium">
								Receiver Name
							</Label>
							<Input
								id="receiverName"
								value={drForm.receiverName}
								onChange={(event) =>
									setDrForm((previous) => ({
										...previous,
										receiverName: event.target.value,
									}))
								}
								placeholder="Receiver full name"
								className="bg-background border-border/70 focus-visible:ring-primary/20"
								disabled={isCreatingDRFromSupplier}
							/>
						</div>
						<div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
							<Label
								htmlFor="receiverSignature"
								className="text-foreground font-medium">
								Receiver Signature
							</Label>
							<Textarea
								id="receiverSignature"
								rows={4}
								value={drForm.receiverSignature}
								onChange={(event) =>
									setDrForm((previous) => ({
										...previous,
										receiverSignature: event.target.value,
									}))
								}
								placeholder="Base64 or signature string"
								className="minimal-scrollbar bg-background border-border/70 focus-visible:ring-primary/20"
								disabled={isCreatingDRFromSupplier}
							/>
						</div>
						<div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
							<Label
								htmlFor="conditionOfGoods"
								className="text-foreground font-medium">
								Condition Of Goods
							</Label>
							<Textarea
								id="conditionOfGoods"
								rows={3}
								value={drForm.conditionOfGoods}
								onChange={(event) =>
									setDrForm((previous) => ({
										...previous,
										conditionOfGoods: event.target.value,
									}))
								}
								placeholder="Good / damaged / notes"
								className="minimal-scrollbar bg-background border-border/70 focus-visible:ring-primary/20"
								disabled={isCreatingDRFromSupplier}
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								className="border-border/60 hover:bg-muted transition-all duration-300"
								onClick={() => handleDRModalChange(false)}
								disabled={isCreatingDRFromSupplier}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-300"
								disabled={isCreatingDRFromSupplier || !supplierDOId}>
								{isCreatingDRFromSupplier ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Creating...
									</>
								) : (
									"Create Receipt"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<PurchaseOrderModal
				open={isPOModalOpen}
				onOpenChange={setIsPOModalOpen}
				purchaseOrderId={order.purchaseOrders?.[0]?.id}
			/>
			<DeliveryOrderModal
				open={isDOModalOpen}
				onOpenChange={setIsDOModalOpen}
				deliveryDocumentId={adminDOId}
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
