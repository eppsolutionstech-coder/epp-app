import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useGetItemById } from "~/hooks/use-item";
import { ProductDetailsView } from "~/components/organism/product-details-view";

export default function supplierProductDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const {
		data: product,
		isLoading,
		isError,
	} = useGetItemById(id!, {
		fields: "id, sku, name, status, description, category.name, supplier.name, srp, supplierPrice, stockQuantity, lowStockThreshold, images, specifications, isActive, isFeatured, isAvailable, createdAt, updatedAt",
	});

	const headerActions = (
		<>
			<Button variant="outline">
				<Pencil className="mr-2 h-4 w-4" />
				Edit Product
			</Button>
			<Button variant="destructive">
				<Trash2 className="mr-2 h-4 w-4" />
				Delete
			</Button>
		</>
	);

	return (
		<ProductDetailsView
			product={product}
			isLoading={isLoading}
			isError={isError}
			headerActions={headerActions}
			showsupplierInfo={false}
		/>
	);
}

