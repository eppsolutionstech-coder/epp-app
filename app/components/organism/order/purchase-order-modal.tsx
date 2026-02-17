import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { PurchaseOrderWithRelations } from "~/zod/purchaseOrder.zod";
import { PurchaseOrderDetails } from "./purchase-order-details";

interface PurchaseOrderModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	purchaseOrder?: PurchaseOrderWithRelations;
}

export function PurchaseOrderModal({ open, onOpenChange, purchaseOrder }: PurchaseOrderModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto p-10 gap-0">
				<PurchaseOrderDetails purchaseOrder={purchaseOrder} />
			</DialogContent>
		</Dialog>
	);
}
