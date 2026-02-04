import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import type { Category } from "~/zod/category.zod";
import type { supplier } from "~/zod/supplier.zod";
import { cn } from "@/lib/utils";

interface CatalogSidebarProps {
	searchTerm: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	categoryFilter: string;
	onCategoryChange: (categoryId: string) => void;
	supplierFilter: string;
	onsupplierChange: (supplierId: string) => void;
	priceRange: string;
	onPriceChange: (range: string) => void;
	categories: Category[];
	suppliers: supplier[];
	hasFilters: boolean;
	onClearFilters: () => void;
	className?: string;
}

export function CatalogSidebar({
	searchTerm,
	onSearchChange,
	categoryFilter,
	onCategoryChange,
	supplierFilter,
	onsupplierChange,
	priceRange,
	onPriceChange,
	categories,
	suppliers,
	hasFilters,
	onClearFilters,
	className,
}: CatalogSidebarProps) {
	const priceRanges = [
		{ label: "Under ₱1,000", value: "0-1000" },
		{ label: "₱1,000 - ₱5,000", value: "1000-5000" },
		{ label: "₱5,000 - ₱10,000", value: "5000-10000" },
		{ label: "₱10,000+", value: "10000-" },
	];

	return (
		<aside
			className={cn(
				"w-full lg:w-[280px] shrink-0 space-y-8 lg:sticky top-0 h-full overflow-hidden flex flex-col pb-4",
				className,
			)}>
			{/* Search */}
			<div className="space-y-3 shrink-0">
				<h3 className="font-semibold text-sm tracking-tight text-foreground/90 px-1">
					Search
				</h3>
				<div className="relative group">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<Input
						placeholder="Search for products..."
						className="pl-9 h-11 bg-muted/30 border-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 transition-all rounded-xl"
						value={searchTerm}
						onChange={onSearchChange}
					/>
				</div>
			</div>

			{/* Filters Container */}
			<div className="flex-1 overflow-hidden flex flex-col">
				<div className="flex items-center justify-between mb-2 px-1">
					<h3 className="font-semibold text-sm tracking-tight text-foreground/90">
						Filters
					</h3>
					{hasFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilters}
							className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors gap-1.5">
							<FilterX className="w-3.5 h-3.5" />
							Reset
						</Button>
					)}
				</div>

				<ScrollArea className="flex-1 -mx-2 px-2">
					<Accordion
						type="multiple"
						defaultValue={["categories", "price", "suppliers"]}
						className="space-y-6">
						{/* Categories */}
						<AccordionItem value="categories" className="border-none">
							<AccordionTrigger className="text-sm font-medium py-2 hover:no-underline hover:text-primary transition-colors group">
								Categories
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-0">
								<div className="space-y-2">
									<label
										className={cn(
											"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
											categoryFilter === "all"
												? "bg-primary/5"
												: "hover:bg-muted/50",
										)}>
										<Checkbox
											checked={categoryFilter === "all"}
											onCheckedChange={() => onCategoryChange("all")}
											className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span
											className={cn(
												"text-sm group-hover/item:text-foreground transition-colors",
												categoryFilter === "all"
													? "font-medium text-primary"
													: "text-muted-foreground",
											)}>
											All Categories
										</span>
									</label>
									{categories.map((category) => (
										<label
											key={category.id}
											className={cn(
												"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
												categoryFilter === category.id
													? "bg-primary/5"
													: "hover:bg-muted/50",
											)}>
											<Checkbox
												checked={categoryFilter === category.id}
												onCheckedChange={() =>
													onCategoryChange(category.id)
												}
												className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span
												className={cn(
													"text-sm group-hover/item:text-foreground transition-colors",
													categoryFilter === category.id
														? "font-medium text-primary"
														: "text-muted-foreground",
												)}>
												{category.name}
											</span>
										</label>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Price Range */}
						<AccordionItem value="price" className="border-none">
							<AccordionTrigger className="text-sm font-medium py-2 hover:no-underline hover:text-primary transition-colors group">
								Price Range
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-0">
								<div className="space-y-2">
									<label
										className={cn(
											"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
											priceRange === "all"
												? "bg-primary/5"
												: "hover:bg-muted/50",
										)}>
										<Checkbox
											checked={priceRange === "all"}
											onCheckedChange={() => onPriceChange("all")}
											className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span
											className={cn(
												"text-sm group-hover/item:text-foreground transition-colors",
												priceRange === "all"
													? "font-medium text-primary"
													: "text-muted-foreground",
											)}>
											Any Price
										</span>
									</label>
									{priceRanges.map((range) => (
										<label
											key={range.value}
											className={cn(
												"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
												priceRange === range.value
													? "bg-primary/5"
													: "hover:bg-muted/50",
											)}>
											<Checkbox
												checked={priceRange === range.value}
												onCheckedChange={() => onPriceChange(range.value)}
												className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span
												className={cn(
													"text-sm group-hover/item:text-foreground transition-colors",
													priceRange === range.value
														? "font-medium text-primary"
														: "text-muted-foreground",
												)}>
												{range.label}
											</span>
										</label>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Suppliers */}
						<AccordionItem value="suppliers" className="border-none">
							<AccordionTrigger className="text-sm font-medium py-2 hover:no-underline hover:text-primary transition-colors group">
								Brands / Suppliers
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-0">
								<div className="space-y-2">
									<label
										className={cn(
											"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
											supplierFilter === "all"
												? "bg-primary/5"
												: "hover:bg-muted/50",
										)}>
										<Checkbox
											checked={supplierFilter === "all"}
											onCheckedChange={() => onsupplierChange("all")}
											className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span
											className={cn(
												"text-sm group-hover/item:text-foreground transition-colors",
												supplierFilter === "all"
													? "font-medium text-primary"
													: "text-muted-foreground",
											)}>
											All Brands
										</span>
									</label>
									{suppliers.map((supplier) => (
										<label
											key={supplier.id}
											className={cn(
												"flex items-center space-x-3 cursor-pointer py-1.5 px-2 rounded-lg transition-all group/item",
												supplierFilter === supplier.id
													? "bg-primary/5"
													: "hover:bg-muted/50",
											)}>
											<Checkbox
												checked={supplierFilter === supplier.id}
												onCheckedChange={() =>
													onsupplierChange(supplier.id)
												}
												className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span
												className={cn(
													"text-sm group-hover/item:text-foreground transition-colors",
													supplierFilter === supplier.id
														? "font-medium text-primary"
														: "text-muted-foreground",
												)}>
												{supplier.name}
											</span>
										</label>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</ScrollArea>
			</div>
		</aside>
	);
}
