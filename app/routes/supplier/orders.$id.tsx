import { useParams, Link } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2, Calendar, CheckCircle, Truck } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "~/components/ui/dialog";
import { useGetPurchaseOrderById, useUpdatePurchaseOrder } from "~/hooks/use-purchase-order";
import { PurchaseOrderDetails } from "~/components/organism/order/purchase-order-details";
import { DeliveryOrderModal } from "~/components/organism/order/delivery-order-modal";
import { type PurchaseOrderWithRelations } from "~/zod/purchaseOrder.zod";
import { toast } from "sonner";

export default function supplierOrderDetailsPage() {
	const { id } = useParams();

	const { data: purchaseOrder, isLoading } = useGetPurchaseOrderById(id!, {
		fields: "id,poNumber,orderId,supplierId,status,items,approvedAt,sentToSupplierAt,notes,createdAt,updatedAt,supplier,totalAmount,requisitioner,contactName,contactDesignation,contactDepartment,contactNumber,contactMobile,contactEmail,approvedBy,leadTime,availability,delivery,pdc,organizationId,deliveryDocuments.id,deliveryDocuments.documentType",
	});

	const { mutate: updatePurchaseOrder, isPending: isUpdating } = useUpdatePurchaseOrder();
	const [showDeliveryOrderModal, setShowDeliveryOrderModal] = useState(false);

	const deliveryOrderId = purchaseOrder?.deliveryDocuments?.find(
		(doc: any) => doc.documentType === "DELIVERY_ORDER",
	)?.id;

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!purchaseOrder) {
		return (
			<div className="flex flex-col items-center justify-center py-12 gap-4">
				<h1 className="text-2xl font-bold">Purchase Order Not Found</h1>
				<p className="text-muted-foreground">
					The purchase order you are looking for does not exist.
				</p>
				<Button asChild>
					<Link to="/supplier/orders">Back to Orders</Link>
				</Button>
			</div>
		);
	}

	const handlePrint = () => {
		window.print();
	};

	const handleConfirmPO = () => {
		updatePurchaseOrder(
			{
				id: purchaseOrder.id,
				data: { status: "CONFIRMED" },
			},
			{
				onSuccess: () => {
					toast.success("Purchase Order confirmed successfully");
				},
				onError: (error) => {
					toast.error(`Failed to confirm purchase order: ${error.message}`);
				},
			},
		);
	};

	return (
		<div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 print:hidden">
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
							PO #{purchaseOrder.poNumber || "N/A"}
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Calendar className="h-3.5 w-3.5" />
							<span>
								Created on {new Date(purchaseOrder.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{purchaseOrder.status === "PENDING" && (
						<Dialog>
							<DialogTrigger asChild>
								<Button
									disabled={isUpdating}
									className="gap-2 rounded-full h-9 bg-green-600 hover:bg-green-700 text-white">
									{isUpdating ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<CheckCircle className="h-4 w-4" />
									)}
									Confirm PO
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Confirm Purchase Order</DialogTitle>
									<DialogDescription>
										After confirming this purchase order, it will automatically
										create a delivery order.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button
										onClick={handleConfirmPO}
										disabled={isUpdating}
										className="bg-green-600 hover:bg-green-700 text-white">
										{isUpdating && (
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
										)}
										Confirm PO
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
					{purchaseOrder.status === "CONFIRMED" && deliveryOrderId && (
						<Button
							className="gap-2 rounded-full h-9 bg-orange-600 hover:bg-orange-700 text-white"
							onClick={() => setShowDeliveryOrderModal(true)}>
							<Truck className="h-4 w-4" />
							Delivery Order
						</Button>
					)}
					<Button
						variant="outline"
						className="gap-2 rounded-full h-9"
						onClick={handlePrint}>
						<Printer className="h-4 w-4" />
						Print PO
					</Button>
				</div>
			</div>

			{/* PO Details Component */}
			<div className="border rounded-lg shadow-sm p-10 bg-white">
				<PurchaseOrderDetails purchaseOrder={purchaseOrder} />
			</div>

			<DeliveryOrderModal
				open={showDeliveryOrderModal}
				onOpenChange={setShowDeliveryOrderModal}
				deliveryDocumentId={deliveryOrderId}
			/>
		</div>
	);
}
