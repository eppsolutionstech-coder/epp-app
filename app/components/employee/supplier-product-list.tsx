import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "~/components/molecule/product-card";
import type { supplierWithRelations } from "~/zod/supplier.zod";

interface SupplierProductListProps {
	suppliers: supplierWithRelations[];
	isEppEmployee?: boolean;
}

export function SupplierProductList({ suppliers, isEppEmployee = false }: SupplierProductListProps) {
	// Filter suppliers that actually have items
	const suppliersWithItems = suppliers.filter((supplier) => supplier.items && supplier.items.length > 0);

	if (suppliersWithItems.length === 0) {
		return null;
	}

	return (
		<div className="space-y-12">
			{suppliersWithItems.map((supplier) => (
				<section key={supplier.id} className="space-y-4">
					<div className="flex items-center justify-between px-1">
						<div className="space-y-1">
							<h2 className="text-2xl font-bold tracking-tight">{supplier.name}</h2>
						</div>
						<Link
							to={`/employee/catalog?supplierId=${supplier.id}`}
							className="group flex items-center text-sm font-medium text-primary hover:underline">
							View all
							<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					<div className="relative">
						<div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 sm:px-0 sm:mx-0 snap-x snap-mandatory hide-scrollbar">
							{supplier.items?.map((item) => (
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
											isEppEmployee={isEppEmployee}
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

