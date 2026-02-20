import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ProductDetailsView } from "~/components/organism/product-details-view";
import { useGetItemById, useUpdateItem } from "~/hooks/use-item";

type PriceFormState = {
	costPrice: string;
	retailerPrice: string;
	wholeSalePrice: string;
};

const toInputPrice = (value: unknown) => {
	const parsed = Number(value ?? 0);
	return String(Number.isFinite(parsed) ? parsed : 0);
};

export default function AdminProductDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const itemId = id || "";
	const [isEditPricesOpen, setIsEditPricesOpen] = useState(false);
	const [priceForm, setPriceForm] = useState<PriceFormState>({
		costPrice: "0",
		retailerPrice: "0",
		wholeSalePrice: "0",
	});

	const {
		data: product,
		isLoading,
		isError,
		refetch,
	} = useGetItemById(itemId, {
		fields: "id, sku, name, status, description, category.name, supplier.name, retailPrice, sellingPrice, costPrice, retailerPrice, wholeSalePrice, stockQuantity, lowStockThreshold, images, specifications, isActive, isFeatured, isAvailable, createdAt, updatedAt",
	});
	const updateItem = useUpdateItem();

	useEffect(() => {
		if (!isEditPricesOpen || !product) return;
		setPriceForm({
			costPrice: toInputPrice(product.costPrice),
			retailerPrice: toInputPrice(product.retailerPrice),
			wholeSalePrice: toInputPrice(product.wholeSalePrice),
		});
	}, [isEditPricesOpen, product]);

	const handleDialogOpenChange = (open: boolean) => {
		setIsEditPricesOpen(open);
		if (open && product) {
			setPriceForm({
				costPrice: toInputPrice(product.costPrice),
				retailerPrice: toInputPrice(product.retailerPrice),
				wholeSalePrice: toInputPrice(product.wholeSalePrice),
			});
		}
	};

	const parsePrice = (value: string) => {
		const normalized = value.trim();
		if (!normalized) return 0;
		const parsed = Number(normalized);
		return Number.isFinite(parsed) ? parsed : Number.NaN;
	};

	const handleUpdatePrices = async () => {
		if (!itemId) return;

		const costPrice = parsePrice(priceForm.costPrice);
		const retailerPrice = parsePrice(priceForm.retailerPrice);
		const wholeSalePrice = parsePrice(priceForm.wholeSalePrice);

		if (
			[costPrice, retailerPrice, wholeSalePrice].some(
				(price) => Number.isNaN(price) || price < 0,
			)
		) {
			toast.error("Please enter valid non-negative prices.");
			return;
		}

		try {
			await updateItem.mutateAsync({
				itemId,
				data: {
					costPrice,
					retailerPrice,
					wholeSalePrice,
				},
			});
			toast.success("Prices updated successfully.");
			setIsEditPricesOpen(false);
			await refetch();
		} catch (error: any) {
			toast.error(error.message || "Failed to update prices.");
		}
	};

	const editPricesAction = (
		<Button variant="outline" size="sm" onClick={() => handleDialogOpenChange(true)}>
			<Pencil className="mr-2 h-4 w-4" />
			Edit Prices
		</Button>
	);

	return (
		<>
			<Dialog open={isEditPricesOpen} onOpenChange={handleDialogOpenChange}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Prices</DialogTitle>
						<DialogDescription>
							Update cost, retailer, and wholesale prices for this product.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label htmlFor="cost-price">Cost Price (PHP)</Label>
							<Input
								id="cost-price"
								type="number"
								min="0"
								step="0.01"
								value={priceForm.costPrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										costPrice: e.target.value,
									}))
								}
								disabled={updateItem.isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="retailer-price">Retailer Price (PHP)</Label>
							<Input
								id="retailer-price"
								type="number"
								min="0"
								step="0.01"
								value={priceForm.retailerPrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										retailerPrice: e.target.value,
									}))
								}
								disabled={updateItem.isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="wholesale-price">Wholesale Price (PHP)</Label>
							<Input
								id="wholesale-price"
								type="number"
								min="0"
								step="0.01"
								value={priceForm.wholeSalePrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										wholeSalePrice: e.target.value,
									}))
								}
								disabled={updateItem.isPending}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => handleDialogOpenChange(false)}
							disabled={updateItem.isPending}>
							Cancel
						</Button>
						<Button onClick={handleUpdatePrices} disabled={updateItem.isPending}>
							{updateItem.isPending && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Save Prices
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ProductDetailsView
				product={product}
				isLoading={isLoading}
				isError={isError}
				showsupplierInfo
				showAdminPriceSection
				adminPriceAction={editPricesAction}
			/>
		</>
	);
}
