import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface OrderItemsListProps {
	items: any[]; // Using any for now as per the parent component's data structure
}

export function OrderItemsList({ items }: OrderItemsListProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
			<CardHeader>
				<CardTitle>Items ({items.length})</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y">
					{items.map((item: any) => (
						<div key={item.id || item.itemId} className="flex gap-4 p-6">
							<div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0 border relative">
								{item.item?.images?.[0]?.url ? (
									<img
										src={item.item.images[0].url}
										alt={item.item.name}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="h-full w-full flex items-center justify-center">
										<Package className="h-8 w-8 text-muted-foreground/30" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-start gap-4">
									<div>
										<h4 className="font-semibold text-foreground/90 line-clamp-2">
											{item.item?.name || "Product Name"}
										</h4>
										<p className="text-sm text-muted-foreground mt-1">
											SKU: {item.item?.sku || "N/A"}
										</p>
										<div className="flex items-center gap-2 mt-2">
											<Badge variant="secondary" className="text-xs">
												Qty: {item.quantity}
											</Badge>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold">
											{formatCurrency(
												item.subtotal || item.unitPrice * item.quantity,
											)}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatCurrency(item.unitPrice)} ea
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
