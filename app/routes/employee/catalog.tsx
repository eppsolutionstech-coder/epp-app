import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Loader2, Search, Filter } from "lucide-react";
import { ProductCard } from "~/components/molecule/product-card";
import { CatalogSidebar } from "~/components/employee/catalog-sidebar";
import { useGetItems } from "~/hooks/use-item";
import { useGetCategories } from "~/hooks/use-category";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import type { Category } from "~/zod/category.zod";
import type { supplier } from "~/zod/supplier.zod";
import { useGetSuppliers } from "~/hooks/use-supplier";

export default function EmployeeCatalog() {
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [supplierFilter, setsupplierFilter] = useState<string>("all");
	const [priceRange, setPriceRange] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("popular");

	// Helper to build filter string from category and supplier
	const buildFilterString = (catFilter: string, venFilter: string) => {
		const parts: string[] = [];
		if (catFilter !== "all") {
			parts.push(`categoryId:${catFilter}`);
		}
		if (venFilter !== "all") {
			parts.push(`supplierId:${venFilter}`);
		}
		return parts.join(",");
	};

	const { apiParams, searchTerm, handleSearchChange, handleFilterChange } = useApiParams({
		limit: 100,
		fields: "id, sku, name, description, category.id, category.name, supplier.id, supplier.name, retailPrice, costPrice, stockQuantity, isActive, status, imageUrl, images",
		filter: "status:APPROVED",
	});

	// Fetch products with server-side filtering
	const {
		data: itemsResponse,
		isLoading: isLoadingProducts,
		isError: isProductsError,
	} = useGetItems(apiParams);

	// Fetch categories for filter
	const { data: categoriesResponse } = useGetCategories({
		limit: 100,
		fields: "id, name",
	});
	const categories: Category[] = categoriesResponse?.categorys || [];

	// Fetch suppliers for filter
	const { data: suppliersResponse } = useGetSuppliers({
		limit: 100,
		fields: "id, name",
	});
	const suppliers: supplier[] = suppliersResponse?.suppliers || [];

	// Client-side price filtering (since API might not support price ranges)
	const filteredProducts = itemsResponse?.items.filter((product) => {
		if (priceRange !== "all") {
			const [min, max] = priceRange.split("-").map(Number);
			const price = Number(product.costPrice);
			if (max && (price < min || price > max)) return false;
			if (!max && price < min) return false;
		}
		return true;
	});

	// Sort products
	const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return Number(a.costPrice) - Number(b.costPrice);
			case "price-high":
				return Number(b.costPrice) - Number(a.costPrice);
			case "name":
				return a.name.localeCompare(b.name);
			default:
				return 0;
		}
	});

	const hasFilters = categoryFilter !== "all" || supplierFilter !== "all" || priceRange !== "all";

	const clearFilters = () => {
		setCategoryFilter("all");
		setsupplierFilter("all");
		setPriceRange("all");
		handleFilterChange("");
	};

	return (
		<div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-4rem)] p-4 sm:p-6 bg-background/50">
			{/* Sidebar Filters */}
			<CatalogSidebar
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				categoryFilter={categoryFilter}
				onCategoryChange={(newCategory: string) => {
					setCategoryFilter(newCategory);
					handleFilterChange(buildFilterString(newCategory, supplierFilter));
				}}
				supplierFilter={supplierFilter}
				onsupplierChange={(newsupplier: string) => {
					setsupplierFilter(newsupplier);
					handleFilterChange(buildFilterString(categoryFilter, newsupplier));
				}}
				priceRange={priceRange}
				onPriceChange={setPriceRange}
				categories={categories}
				suppliers={suppliers}
				hasFilters={hasFilters}
				onClearFilters={clearFilters}
			/>

			{/* Main Content */}
			<main className="flex-1 space-y-8">
				{/* Header */}
				<div className="flex flex-col gap-6">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								Catalog
							</h1>
							<p className="text-muted-foreground">
								Discover premium equipment and supplies for your workspace.
							</p>
						</div>

						<div className="flex items-center gap-3 shrink-0">
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px] h-9 bg-background/50 backdrop-blur-sm border-input hover:bg-accent/50 transition-colors">
									<Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent align="end">
									<SelectItem value="popular">Most Popular</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
									<SelectItem value="name">Name A-Z</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Quick Filter Pills */}
					<div className="flex flex-wrap gap-2">
						<Badge
							variant={categoryFilter === "all" ? "default" : "outline"}
							className="px-4 py-1.5 h-8 text-sm font-medium rounded-full cursor-pointer hover:opacity-90 transition-all active:scale-95 select-none"
							onClick={() => {
								setCategoryFilter("all");
								handleFilterChange(buildFilterString("all", supplierFilter));
							}}>
							All
						</Badge>
						{categories.map((category) => (
							<Badge
								key={category.id}
								variant={categoryFilter === category.id ? "default" : "outline"}
								className="px-4 py-1.5 h-8 text-sm font-medium rounded-full cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-all active:scale-95 select-none"
								onClick={() => {
									const newFilter =
										categoryFilter === category.id ? "all" : category.id;
									setCategoryFilter(newFilter);
									handleFilterChange(buildFilterString(newFilter, supplierFilter));
								}}>
								{category.name}
							</Badge>
						))}
					</div>
				</div>

				{/* Product Grid */}
				{isLoadingProducts ? (
					<div className="flex flex-col items-center justify-center py-32 space-y-4">
						<Loader2 className="h-10 w-10 animate-spin text-primary/50" />
						<p className="text-sm text-muted-foreground animate-pulse">
							Loading products...
						</p>
					</div>
				) : isProductsError ? (
					<div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
						<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
							<SlidersHorizontal className="h-8 w-8 text-destructive" />
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">Failed to load catalog</h3>
							<p className="text-muted-foreground max-w-sm">
								We couldn't fetch the products. Please check your connection and try
								again.
							</p>
						</div>
						<Button variant="outline" onClick={() => window.location.reload()}>
							Reload Page
						</Button>
					</div>
				) : sortedProducts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-12">
						{sortedProducts.map((product) => (
							<Link
								key={product.id}
								to={`/employee/product/${product.id}`}
								className="group h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
								<ProductCard
									product={{
										id: product.id,
										name: product.name,
										sku: product.sku,
										retailPrice: Number(product.retailPrice),
										sellingPrice: Number(product.sellingPrice),
										costPrice: Number(product.costPrice),
										stockQuantity: product.stockQuantity,
										lowStockThreshold: product.lowStockThreshold || 10,
										status: product.status as any,
										imageUrl: product.images?.[0]?.url || product.imageUrl,
										isActive: product.isActive,
										itemType: product.itemType,
										supplierId: product.supplierId,
										categoryId: product.categoryId,
										images: product.images,
										specifications: product.specifications,
										isFeatured: product.isFeatured,
										isAvailable: product.isAvailable,
										createdAt: product.createdAt,
										updatedAt: product.updatedAt,
									}}
									variant="employee"
								/>
							</Link>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
						<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
							<Search className="h-8 w-8 text-muted-foreground" />
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">No products found</h3>
							<p className="text-muted-foreground max-w-sm">
								We couldn't find matches for your search. Try broadening your
								filters.
							</p>
						</div>
						<Button variant="secondary" onClick={clearFilters}>
							Clear all filters
						</Button>
					</div>
				)}
			</main>
		</div>
	);
}

