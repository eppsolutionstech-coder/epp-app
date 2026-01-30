import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "~/components/molecule/product-card";
import type { VendorWithRelations } from "~/zod/vendor.zod";

interface VendorProductListProps {
	vendors: VendorWithRelations[];
}

export function VendorProductList({ vendors }: VendorProductListProps) {
	// Filter vendors that actually have items
	const vendorsWithItems = vendors.filter((vendor) => vendor.items && vendor.items.length > 0);

	if (vendorsWithItems.length === 0) {
		return null;
	}

	return (
		<div className="space-y-12">
			{vendorsWithItems.map((vendor) => (
				<section key={vendor.id} className="space-y-4">
					<div className="flex items-center justify-between px-1">
						<div className="space-y-1">
							<h2 className="text-2xl font-bold tracking-tight">{vendor.name}</h2>
						</div>
						<Link
							to={`/employee/catalog?vendorId=${vendor.id}`}
							className="group flex items-center text-sm font-medium text-primary hover:underline">
							View all
							<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					<div className="relative">
						<div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 sm:px-0 sm:mx-0 snap-x snap-mandatory hide-scrollbar">
							{vendor.items?.map((item) => (
								<div
									key={item.id}
									className="flex-none w-[280px] snap-start transition-opacity hover:opacity-100">
									<Link
										to={`/employee/product/${item.id}`}
										className="block h-full">
										<ProductCard
											product={{
												...item,
												retailPrice: Number(item.retailPrice),
												costPrice: item.costPrice
													? Number(item.costPrice)
													: null,
												imageUrl: item.images?.[0]?.url || item.imageUrl,
											}}
											variant="landing"
										/>
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>
			))}
		</div>
	);
}
