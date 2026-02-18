import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DeliveryOrderDetails } from "./delivery-order-details";
import { useGetDeliveryDocumentById } from "~/hooks/use-delivery-document";
import { Loader2 } from "lucide-react";

interface DeliveryOrderModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	deliveryDocumentId?: string;
}

export function DeliveryOrderModal({
	open,
	onOpenChange,
	deliveryDocumentId,
}: DeliveryOrderModalProps) {
	const { data: deliveryDocument, isLoading } = useGetDeliveryDocumentById(
		deliveryDocumentId || "",
		{
			fields: "id, documentNumber, documentDate, fromLocation, toName, toAddress, carrierInfo, trackingNumber, expectedDeliveryDate, items, receiverName, updatedAt",
		},
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-y-auto p-10 gap-0">
				{isLoading ? (
					<div className="flex h-96 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<DeliveryOrderDetails deliveryDocument={deliveryDocument} />
				)}
			</DialogContent>
		</Dialog>
	);
}
