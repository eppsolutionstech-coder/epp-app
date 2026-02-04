import { useParams } from "react-router";
import { useGetItemById } from "~/hooks/use-item";
import { ProductDetailsView } from "~/components/organism/product-details-view";

export default function AdminProductDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const { data: product, isLoading, isError } = useGetItemById(id!);

	return (
		<ProductDetailsView
			product={product}
			isLoading={isLoading}
			isError={isError}
			showsupplierInfo={true}
		/>
	);
}

