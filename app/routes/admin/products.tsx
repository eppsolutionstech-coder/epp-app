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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Package, LayoutGrid, List, Check, X } from "lucide-react";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { ProductGrid } from "~/components/organism/product-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetItems, useUpdateItem } from "~/hooks/use-item";
import { useGetCategories } from "~/hooks/use-category";
import { useGetVendors } from "~/hooks/use-vendor";
import type { Category } from "~/zod/category.zod";
import type { Vendor } from "~/zod/vendor.zod";
import type { ItemWithRelation } from "~/zod/item.zod";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";

export default function AdminProductsPage() {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [vendorFilter, setVendorFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Mutation for approving/rejecting
	const updateItem = useUpdateItem();

	const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
		try {
			await updateItem.mutateAsync({
				itemId: id,
				data: { status: newStatus },
			});
			toast.success(`Product ${newStatus.toLowerCase()} successfully`);
		} catch (error: any) {
			toast.error(error.message || "Failed to update product status");
		}
	};

	// Helper to build filter string from category, vendor, and status
	const buildFilterString = (catFilter: string, venFilter: string, statFilter: string) => {
		const parts: string[] = [];
		if (catFilter !== "all") {
			parts.push(`categoryId:${catFilter}`);
		}
		if (venFilter !== "all") {
			parts.push(`vendorId:${venFilter}`);
		}
		if (statFilter !== "all") {
			parts.push(`status:${statFilter}`);
		}
		return parts.join(",");
	};

	const { apiParams, searchTerm, handleSearchChange, handleFilterChange } = useApiParams({
		limit: 100,
		fields: "id, sku, name, description, category.id, category.name, vendor.id, vendor.name, retailPrice, sellingPrice, costPrice, stockQuantity, isActive, status, imageUrl, images",
		filter: statusFilter !== "all" ? `status:${statusFilter}` : undefined,
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

	const handleRowClick = (product: ItemWithRelation) => {
		navigate(`/admin/products/${product.id}`);
	};

	const columns: DataTableColumn<ItemWithRelation>[] = [
		{
			key: "name",
			label: "Product Name",
			sortable: true,
			className: "w-[500px] max-w-[500px]",
			render: (_, row) => {
				const firstImageUrl = row.images?.[0]?.url || row.imageUrl;
				return (
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
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
						<div className="min-w-0 flex-1">
							<p className="font-medium truncate" title={row.name}>
								{row.name}
							</p>
							<p className="text-xs text-muted-foreground truncate">{row.sku}</p>
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
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Pending", value: "PENDING" },
				{ label: "Approved", value: "APPROVED" },
				{ label: "Rejected", value: "REJECTED" },
			],
			render: (value) => (
				<Badge variant="outline" className="h-5 text-[10px] px-1.5 py-0 lowercase">
					{String(value)}
				</Badge>
			),
		},
		{
			key: "id",
			label: "Actions",
			className: "text-right",
			render: (_, row) => (
				<div className="text-right">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							{row.status === "PENDING" && (
								<>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											handleStatusUpdate(row.id, "APPROVED");
										}}>
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Approve
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											handleStatusUpdate(row.id, "REJECTED");
										}}>
										<X className="mr-2 h-4 w-4 text-red-500" />
										Reject
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem>View Details</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	if (isProductsError) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Products</h1>
						<p className="text-muted-foreground">
							Manage your product catalog and listings.
						</p>
					</div>
				</div>
				<div className="text-center py-16 text-muted-foreground">
					Failed to load products. Please try again.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">All Products</h1>
					<p className="text-muted-foreground">
						Manage your product catalog and listings.
					</p>
				</div>
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
					<div className="flex items-center gap-2">
						{viewMode === "grid" && (
							<>
								<Select
									value={statusFilter}
									onValueChange={(value) => {
										setStatusFilter(value);
										handleFilterChange(
											buildFilterString(categoryFilter, vendorFilter, value),
										);
									}}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="All Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="PENDING">Pending</SelectItem>
										<SelectItem value="APPROVED">Approved</SelectItem>
										<SelectItem value="REJECTED">Rejected</SelectItem>
									</SelectContent>
								</Select>

								<Select
									value={categoryFilter}
									onValueChange={(value) => {
										setCategoryFilter(value);
										handleFilterChange(
											buildFilterString(value, vendorFilter, statusFilter),
										);
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
										handleFilterChange(
											buildFilterString(categoryFilter, value, statusFilter),
										);
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

								{(categoryFilter !== "all" ||
									vendorFilter !== "all" ||
									statusFilter !== "all") && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setCategoryFilter("all");
											setVendorFilter("all");
											setStatusFilter("all");
											handleFilterChange("");
										}}>
										Clear Filters
									</Button>
								)}
							</>
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
						<ProductGrid products={products} />
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
