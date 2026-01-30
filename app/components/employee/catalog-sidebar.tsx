import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type { Category } from "~/zod/category.zod";
import type { Vendor } from "~/zod/vendor.zod";

interface CatalogSidebarProps {
	searchTerm: string;
	onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	categoryFilter: string;
	onCategoryChange: (categoryId: string) => void;
	vendorFilter: string;
	onVendorChange: (vendorId: string) => void;
	priceRange: string;
	onPriceChange: (range: string) => void;
	categories: Category[];
	vendors: Vendor[];
	hasFilters: boolean;
	onClearFilters: () => void;
}

export function CatalogSidebar({
	searchTerm,
	onSearchChange,
	categoryFilter,
	onCategoryChange,
	vendorFilter,
	onVendorChange,
	priceRange,
	onPriceChange,
	categories,
	vendors,
	hasFilters,
	onClearFilters,
}: CatalogSidebarProps) {
	const priceRanges = [
		{ label: "Under ₱1,000", value: "0-1000" },
		{ label: "₱1,000 - ₱5,000", value: "1000-5000" },
		{ label: "₱5,000 - ₱10,000", value: "5000-10000" },
		{ label: "₱10,000+", value: "10000-" },
	];

	return (
		<aside className="w-full lg:w-[280px] shrink-0 space-y-6 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
			{/* Search */}
			<div className="relative shrink-0">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search products..."
					className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring transition-all"
					value={searchTerm}
					onChange={onSearchChange}
				/>
			</div>

			{/* Filters Container */}
			<div className="flex-1 overflow-hidden flex flex-col rounded-xl border bg-card/50 shadow-sm">
				{/* Header */}
				<div className="p-4 border-b flex items-center justify-between shrink-0 bg-muted/20">
					<h3 className="font-medium text-sm text-foreground/80">Filters</h3>
					{hasFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearFilters}
							className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-transparent">
							Reset all
						</Button>
					)}
				</div>

				{/* Scrollable Content */}
				<ScrollArea className="flex-1">
					<Accordion
						type="multiple"
						defaultValue={["categories", "price"]}
						className="px-4 py-2">
						{/* Categories */}
						<AccordionItem value="categories" className="border-b-0 mb-2">
							<AccordionTrigger className="text-sm font-medium py-3 hover:no-underline hover:text-primary transition-colors group">
								<span className="group-hover:translate-x-0.5 transition-transform">
									Categories
								</span>
							</AccordionTrigger>
							<AccordionContent className="pt-0 pb-2">
								<div className="space-y-1.5 ml-1">
									<label className="flex items-center space-x-3 cursor-pointer py-1 group/item">
										<Checkbox
											checked={categoryFilter === "all"}
											onCheckedChange={() => onCategoryChange("all")}
											className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
											All
										</span>
									</label>
									{categories.map((category) => (
										<label
											key={category.id}
											className="flex items-center space-x-3 cursor-pointer py-1 group/item">
											<Checkbox
												checked={categoryFilter === category.id}
												onCheckedChange={() =>
													onCategoryChange(category.id)
												}
												className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
												{category.name}
											</span>
										</label>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>

						<Separator className="bg-border/60" />

						{/* Price Range */}
						<AccordionItem value="price" className="border-b-0 my-2">
							<AccordionTrigger className="text-sm font-medium py-3 hover:no-underline hover:text-primary transition-colors group">
								<span className="group-hover:translate-x-0.5 transition-transform">
									Price Range
								</span>
							</AccordionTrigger>
							<AccordionContent className="pt-0 pb-2">
								<div className="space-y-1.5 ml-1">
									<label className="flex items-center space-x-3 cursor-pointer py-1 group/item">
										<Checkbox
											checked={priceRange === "all"}
											onCheckedChange={() => onPriceChange("all")}
											className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
											Any price
										</span>
									</label>
									{priceRanges.map((range) => (
										<label
											key={range.value}
											className="flex items-center space-x-3 cursor-pointer py-1 group/item">
											<Checkbox
												checked={priceRange === range.value}
												onCheckedChange={() => onPriceChange(range.value)}
												className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
												{range.label}
											</span>
										</label>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>

						<Separator className="bg-border/60" />

						{/* Vendors */}
						<AccordionItem value="vendors" className="border-b-0 mt-2">
							<AccordionTrigger className="text-sm font-medium py-3 hover:no-underline hover:text-primary transition-colors group">
								<span className="group-hover:translate-x-0.5 transition-transform">
									Brands
								</span>
							</AccordionTrigger>
							<AccordionContent className="pt-0 pb-2">
								<div className="space-y-1.5 ml-1">
									<label className="flex items-center space-x-3 cursor-pointer py-1 group/item">
										<Checkbox
											checked={vendorFilter === "all"}
											onCheckedChange={() => onVendorChange("all")}
											className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
										/>
										<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
											All brands
										</span>
									</label>
									{vendors.map((vendor) => (
										<label
											key={vendor.id}
											className="flex items-center space-x-3 cursor-pointer py-1 group/item">
											<Checkbox
												checked={vendorFilter === vendor.id}
												onCheckedChange={() => onVendorChange(vendor.id)}
												className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
											/>
											<span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
												{vendor.name}
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
