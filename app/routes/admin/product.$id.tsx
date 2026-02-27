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
	employeePrice: string;
	standardPrice: string;
	wholesalePrice: string;
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
		employeePrice: "0",
		standardPrice: "0",
		wholesalePrice: "0",
	});

	const {
		data: product,
		isLoading,
		isError,
		refetch,
	} = useGetItemById(itemId, {
		fields: "id, sku, name, status, description, category.name, supplier.name, srp, supplierPrice, employeePrice, standardPrice, wholesalePrice, stockQuantity, lowStockThreshold, images, specifications, isActive, isFeatured, isAvailable, createdAt, updatedAt",
	});
	const updateItem = useUpdateItem();

	useEffect(() => {
		if (!isEditPricesOpen || !product) return;
		setPriceForm({
			employeePrice: toInputPrice(product.employeePrice),
			standardPrice: toInputPrice(product.standardPrice),
			wholesalePrice: toInputPrice(product.wholesalePrice),
		});
	}, [isEditPricesOpen, product]);

	const handleDialogOpenChange = (open: boolean) => {
		setIsEditPricesOpen(open);
		if (open && product) {
			setPriceForm({
				employeePrice: toInputPrice(product.employeePrice),
				standardPrice: toInputPrice(product.standardPrice),
				wholesalePrice: toInputPrice(product.wholesalePrice),
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

		const employeePrice = parsePrice(priceForm.employeePrice);
		const standardPrice = parsePrice(priceForm.standardPrice);
		const wholesalePrice = parsePrice(priceForm.wholesalePrice);

		if (
			[employeePrice, standardPrice, wholesalePrice].some(
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
					employeePrice,
					standardPrice,
					wholesalePrice,
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
							Update employee, standard, and wholesale prices for this product.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label htmlFor="cost-price">Employee Price (PHP)</Label>
							<Input
								id="cost-price"
								type="number"
								min="0"
								step="0.01"
								value={priceForm.employeePrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										employeePrice: e.target.value,
									}))
								}
								disabled={updateItem.isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="retailer-price">Standard Price (PHP)</Label>
							<Input
								id="retailer-price"
								type="number"
								min="0"
								step="0.01"
								value={priceForm.standardPrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										standardPrice: e.target.value,
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
								value={priceForm.wholesalePrice}
								onChange={(e) =>
									setPriceForm((prev) => ({
										...prev,
										wholesalePrice: e.target.value,
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
