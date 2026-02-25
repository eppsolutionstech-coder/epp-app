import { useState } from "react";
import { Link } from "react-router";
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
import type { Supplier } from "~/zod/supplier.zod";
import { useGetSuppliers } from "~/hooks/use-supplier";
import { cn } from "@/lib/utils";
import { useAuth } from "~/hooks/use-auth";

export default function EmployeeCatalog() {
	const { user } = useAuth();
	const isEppEmployee = (user?.role as string) === "epp-employee";
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
	const suppliers: Supplier[] = suppliersResponse?.suppliers || [];

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
				return 0; // Default is usually popular or id based
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
		<div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-background/30 dark:bg-background/95">
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
				className="lg:flex"
			/>
			{/* Keep original behavior for mobile - just stacked */}
			<div className="lg:hidden">
				{/* Mobile Filter Sheet TRIGGER would go here - skipping for now to match original functionality but could exist */}
			</div>

			{/* Main Content */}
			<main className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
				{/* Header */}
				<div className="flex flex-col gap-6">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
						<div className="space-y-2">
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent pb-1">
								Products
							</h1>
							<p className="text-muted-foreground text-base max-w-2xl">
								Browse and manage your organization's equipment and supplies
								procurement.
							</p>
						</div>

						<div className="flex items-center gap-3 shrink-0">
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px] h-10 bg-background/50 backdrop-blur-sm border-input hover:border-primary/50 transition-all rounded-lg shadow-sm">
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
					<div className="flex flex-wrap gap-2 pb-2">
						<Badge
							variant={categoryFilter === "all" ? "default" : "secondary"}
							className={cn(
								"px-4 py-1.5 h-8 text-sm font-medium rounded-full cursor-pointer transition-all active:scale-95 select-none",
								categoryFilter === "all"
									? "shadow-md hover:opacity-90"
									: "bg-background border border-border hover:border-primary/50 hover:bg-muted",
							)}	
							onClick={() => {
								setCategoryFilter("all");
								handleFilterChange(buildFilterString("all", supplierFilter));
							}}>
							All
						</Badge>
						{categories.map((category) => (
							<Badge
								key={category.id}
								variant={categoryFilter === category.id ? "default" : "secondary"}
								className={cn(
									"px-4 py-1.5 h-8 text-sm font-medium rounded-full cursor-pointer transition-all active:scale-95 select-none",
									categoryFilter === category.id
										? "shadow-md hover:opacity-90"
										: "bg-background border border-border hover:border-primary/50 hover:bg-muted",
								)}
								onClick={() => {
									const newFilter =
										categoryFilter === category.id ? "all" : category.id;
									setCategoryFilter(newFilter);
									handleFilterChange(
										buildFilterString(newFilter, supplierFilter),
									);
								}}>
								{category.name}
							</Badge>
						))}
					</div>
				</div>

				{/* Product Grid */}
				{isLoadingProducts ? (
					<div className="flex flex-col items-center justify-center py-32 space-y-6 min-h-[400px]">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
							<Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
						</div>
						<p className="text-sm font-medium text-muted-foreground animate-pulse">
							Loading catalog...
						</p>
					</div>
				) : isProductsError ? (
					<div className="flex flex-col items-center justify-center py-32 space-y-6 text-center min-h-[400px]">
						<div className="h-20 w-20 rounded-full bg-destructive/5 flex items-center justify-center ring-1 ring-destructive/10">
							<SlidersHorizontal className="h-10 w-10 text-destructive/80" />
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">Unable to load catalog</h3>
							<p className="text-muted-foreground max-w-sm mx-auto">
								We encountered an issue fetching the products. Please verify your
								connection.
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
							className="mt-4">
							Reload Page
						</Button>
					</div>
				) : sortedProducts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 pb-12">
						{sortedProducts.map((product, index) => (
							<Link
								key={product.id}
								to={`/employee/product/${product.id}`}
								className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
								style={{ animationDelay: `${index * 50}ms` }} // Staggered fade in
							>
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
									isEppEmployee={isEppEmployee}
								/>
							</Link>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-32 space-y-6 text-center min-h-[400px] border-2 border-dashed border-muted rounded-xl bg-muted/5">
						<div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
							<Search className="h-10 w-10 text-muted-foreground/50" />
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-xl">No products found</h3>
							<p className="text-muted-foreground max-w-sm mx-auto">
								No items match your current filters. Try adjusting your search or
								categories.
							</p>
						</div>
						<Button variant="secondary" onClick={clearFilters} className="mt-2">
							Clear all filters
						</Button>
					</div>
				)}
			</main>
		</div>
	);
}
