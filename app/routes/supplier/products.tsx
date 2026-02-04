import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Plus,
	MoreHorizontal,
	Package,
	Search,
	FolderOpen,
	Loader2,
	Pencil,
	Trash2,
	LayoutGrid,
	List,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "~/components/molecule/product-card";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { Link, useNavigate } from "react-router";
import { useGetItems, useCreateItem, useUpdateItem } from "~/hooks/use-item";
import { useGetCategories } from "~/hooks/use-category";
import { ProductUpsertModal } from "~/components/supplier/product-upsert-modal";
import type { Item } from "~/zod/item.zod";
import type { CategoryWithRelation } from "~/zod/category.zod";
import { toast } from "sonner";

import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import { useGetSuppliers } from "~/hooks/use-supplier";

export default function supplierProductsPage() {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Item | null>(null);
	const [viewMode, setViewMode] = useState<"grid" | "table">("table");

	const { apiParams, searchTerm, handleSearchChange } = useApiParams({
		limit: 100,
		fields: "id, sku, name, description, categoryId, category.name, retailPrice, sellingPrice, stockQuantity, isActive, status, imageUrl, images",
	});

	// Fetch products
	const { data: itemsResponse, isLoading, isError } = useGetItems(apiParams);

	// Fetch categories for dropdown
	const { data: categoriesResponse } = useGetCategories({
		limit: 100,
		fields: "id, name",
	});

	const { data: suppliersResponse } = useGetSuppliers({
		limit: 100,
		fields: "id",
	});

	// Mutations
	const createItem = useCreateItem();
	const updateItem = useUpdateItem();

	const products: Item[] = itemsResponse?.items || [];
	const categories: CategoryWithRelation[] = categoriesResponse?.categorys || [];

	const getStatusVariant = (
		status: string,
	): "default" | "secondary" | "outline" | "destructive" => {
		switch (status) {
			case "APPROVED":
				return "default";
			case "PENDING":
				return "outline";
			case "REJECTED":
				return "destructive";
			default:
				return "secondary";
		}
	};

	const handleOpenCreateModal = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (product: Item) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleSubmit = async (formData: FormData) => {
		const supplierId = suppliersResponse?.suppliers?.[0]?.id;

		if (!supplierId) {
			toast.error("Unable to determine supplier. Please try again.");
			return;
		}

		// Add supplierId to the FormData
		formData.append("supplierId", supplierId);

		try {
			if (editingProduct) {
				await updateItem.mutateAsync({
					itemId: editingProduct.id,
					data: formData,
				});
				toast.success("Product updated successfully");
			} else {
				await createItem.mutateAsync(formData);
				toast.success("Product created successfully");
			}
			setIsModalOpen(false);
			setEditingProduct(null);
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		}
	};

	const isMutating = createItem.isPending || updateItem.isPending;

	const handleRowClick = (product: Item) => {
		navigate(`/supplier/products/${product.id}`);
	};

	// Define columns for DataTable
	const columns: DataTableColumn<Item>[] = [
		{
			key: "name",
			label: "Product",
			sortable: true,
			searchable: true,
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
			key: "categoryId",
			label: "Category",
			sortable: true,
			render: (_, row) => (row as any).category?.name || "â€”",
		},
		{
			key: "retailPrice",
			label: "Retail Price",
			sortable: true,
			render: (value) => `₱${Number(value).toLocaleString()}`,
		},
		{
			key: "sellingPrice",
			label: "Selling Price",
			sortable: true,
			render: (value) => `₱${Number(value).toLocaleString()}`,
		},
		{
			key: "stockQuantity",
			label: "Stock",
			sortable: true,
			render: (value, row) => (
				<span className={row.stockQuantity < 10 ? "text-red-500 font-medium" : ""}>
					{String(value)}
				</span>
			),
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			render: (value) => (
				<Badge variant={getStatusVariant(String(value))} className="capitalize">
					{String(value).toLowerCase()}
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
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									handleOpenEditModal(row);
								}}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Product
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Product
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	if (isLoading) {
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
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	if (isError) {
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
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Products</h1>
					<p className="text-muted-foreground">
						Manage your product catalog and listings.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							className="pl-8 w-[200px] lg:w-[280px] bg-white border-input"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div>
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
					<Button variant="outline" asChild>
						<Link to="/supplier/categories">
							<FolderOpen className="mr-2 h-4 w-4" />
							Manage Categories
						</Link>
					</Button>
					<Button onClick={handleOpenCreateModal}>
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Button>
				</div>
			</div>

			{/* Products Content */}
			{products.length === 0 ? (
				<div className="text-center py-16 text-muted-foreground">
					No products found. Create your first product to get started.
				</div>
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{products.map((product) => (
						<Link key={product.id} to={`/supplier/products/${product.id}`}>
							<ProductCard product={product} variant="supplier" />
						</Link>
					))}
				</div>
			) : (
				<div className="rounded-md border bg-card">
					<DataTable columns={columns} data={products} onRowClick={handleRowClick} />
				</div>
			)}

			{/* Product Upsert Modal */}
			<ProductUpsertModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				product={editingProduct}
				categories={categories}
				onSubmit={handleSubmit}
				isLoading={isMutating}
			/>
		</div>
	);
}
