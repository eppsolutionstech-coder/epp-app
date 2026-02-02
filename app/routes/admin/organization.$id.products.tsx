import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Package, LayoutGrid, List, SlidersHorizontal, Search } from "lucide-react";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { ProductCard } from "~/components/molecule/product-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetItems } from "~/hooks/use-item";
import { useGetCategories } from "~/hooks/use-category";
import { useGetVendors } from "~/hooks/use-vendor";
import type { Category } from "~/zod/category.zod";
import type { Vendor } from "~/zod/vendor.zod";
import type { Item, ItemWithRelation } from "~/zod/item.zod";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import { cn } from "~/lib/utils";

export default function OrganizationProductsPage() {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState<"grid" | "table">("table");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [vendorFilter, setVendorFilter] = useState<string>("all");

	// Helper to build filter string from category and vendor
	const buildFilterString = (catFilter: string, venFilter: string) => {
		const parts: string[] = [];
		if (catFilter !== "all") {
			parts.push(`categoryId:${catFilter}`);
		}
		if (venFilter !== "all") {
			parts.push(`vendorId:${venFilter}`);
		}
		return parts.join(",");
	};

	const { apiParams, searchTerm, handleSearchChange, handleFilterChange } = useApiParams({
		limit: 100,
		fields: "id, sku, name, description, category.id, category.name, vendor.id, vendor.name, retailPrice, sellingPrice, costPrice, stockQuantity, isActive, status, imageUrl, images",
		filter: "status:APPROVED",
	});

	// Fetch products with server-side filtering
	const {
		data: itemsResponse,
		isLoading: isLoadingProducts,
		isError: isProductsError,
	} = useGetItems(apiParams);
	const products: ItemWithRelation[] = itemsResponse?.items || [];

	// Fetch categories for filter dropdown
	const { data: categoriesResponse } = useGetCategories({
		limit: 100,
		fields: "id, name",
	});
	const categories: Category[] = categoriesResponse?.categorys || [];

	// Fetch vendors for filter dropdown
	const { data: vendorsResponse } = useGetVendors({
		limit: 100,
		fields: "id, name",
	});
	const vendors: Vendor[] = vendorsResponse?.vendors || [];

	const handleRowClick = (product: Item | ItemWithRelation) => {
		navigate(`/admin/products/${product.id}`);
	};

	const columns: DataTableColumn<ItemWithRelation>[] = [
		{
			key: "name",
			label: "Product Name",
			sortable: true,
			render: (_, row) => {
				const firstImageUrl = row.images?.[0]?.url || row.imageUrl;
				return (
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
							{firstImageUrl ? (
								<img
									src={firstImageUrl}
									alt={row.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<Package className="h-5 w-5 text-muted-foreground" />
							)}
						</div>
						<div>
							<p className="font-medium">{row.name}</p>
							<p className="text-xs text-muted-foreground">{row.sku}</p>
						</div>
					</div>
				);
			},
		},
		{
			key: "category" as keyof ItemWithRelation,
			label: "Category",
			sortable: true,
			filterable: true,
			filterOptions: categories.map((cat) => ({
				key: "categoryId",
				value: cat.id,
				label: cat.name,
			})),
			render: (_, row) => row.category?.name || "—",
		},
		{
			key: "vendor" as keyof ItemWithRelation,
			label: "Vendor",
			sortable: true,
			filterable: true,
			filterOptions: vendors.map((ven) => ({
				key: "vendorId",
				value: ven.id,
				label: ven.name,
			})),
			render: (_, row) => row.vendor?.name || "—",
		},
		{
			key: "retailPrice",
			label: "Retail Price",
			sortable: true,
			render: (value) => <div className="text-right">₱{Number(value).toLocaleString()}</div>,
		},
		{
			key: "sellingPrice",
			label: "Selling Price",
			sortable: true,
			render: (value) => <div className="text-right">₱{Number(value).toLocaleString()}</div>,
		},
		{
			key: "costPrice",
			label: "Cost Price",
			sortable: true,
			render: (value) => <div className="text-right">₱{Number(value).toLocaleString()}</div>,
		},
		{
			key: "stockQuantity",
			label: "Stock",
			sortable: true,
			render: (value, row) => (
				<div
					className={cn(
						"text-center",
						row.stockQuantity < 10 ? "text-red-500 font-medium" : "",
					)}>
					{String(value)}
				</div>
			),
		},
	];

	if (isProductsError) {
		return (
			<div className="space-y-6">
				<div className="text-center py-16 text-muted-foreground">
					Failed to load products. Please try again.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<SearchInput
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search products..."
					/>
					<Tabs
						value={viewMode}
						onValueChange={(v) => setViewMode(v as "grid" | "table")}>
						<TabsList className="border border-input">
							<TabsTrigger value="grid" className="px-3">
								<LayoutGrid className="h-4 w-4" />
							</TabsTrigger>
							<TabsTrigger value="table" className="px-3">
								<List className="h-4 w-4" />
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>

			{/* Filter Dropdowns */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Select
							value={categoryFilter}
							onValueChange={(value) => {
								setCategoryFilter(value);
								handleFilterChange(buildFilterString(value, vendorFilter));
							}}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category.id} value={category.id}>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={vendorFilter}
							onValueChange={(value) => {
								setVendorFilter(value);
								handleFilterChange(buildFilterString(categoryFilter, value));
							}}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="All Vendors" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Vendors</SelectItem>
								{vendors.map((vendor) => (
									<SelectItem key={vendor.id} value={vendor.id}>
										{vendor.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{(categoryFilter !== "all" || vendorFilter !== "all") && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setCategoryFilter("all");
									setVendorFilter("all");
									handleFilterChange("status:APPROVED");
								}}>
								Clear Filters
							</Button>
						)}
					</div>

					<div className="text-sm text-muted-foreground">
						<span>
							Total:{" "}
							<span className="font-semibold text-foreground">{products.length}</span>{" "}
							products
						</span>
					</div>
				</div>

				<div className="space-y-4">
					{viewMode === "grid" ? (
						products.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-10 text-center">
								<p className="text-muted-foreground">No products found.</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										variant="admin"
										onClick={handleRowClick}
									/>
								))}
							</div>
						)
					) : (
						<div className="rounded-md border bg-card">
							<DataTable
								columns={columns}
								data={products}
								isLoading={isLoadingProducts}
								skeletonRowCount={8}
								onRowClick={handleRowClick}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
