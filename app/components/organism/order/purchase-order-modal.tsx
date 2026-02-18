import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PurchaseOrderDetails } from "./purchase-order-details";
import { useGetPurchaseOrderById } from "~/hooks/use-purchase-order";
import { Loader2 } from "lucide-react";

interface PurchaseOrderModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	purchaseOrderId?: string;
}

export function PurchaseOrderModal({
	open,
	onOpenChange,
	purchaseOrderId,
}: PurchaseOrderModalProps) {
	const { data: purchaseOrder, isLoading } = useGetPurchaseOrderById(purchaseOrderId || "", {
		fields: "id, poNumber, createdAt, supplier.name, supplier.address, contactName, contactDesignation, contactDepartment, contactNumber, contactMobile, contactEmail, requisitioner, pdc, leadTime, availability, delivery, items, approvedBy, approvedAt",
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-y-auto p-10 gap-0">
				{isLoading ? (
					<div className="flex h-96 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<PurchaseOrderDetails purchaseOrder={purchaseOrder} />
				)}
			</DialogContent>
		</Dialog>
	);
}
