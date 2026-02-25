import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { Item, ItemWithRelation } from "~/zod/item.zod";
import { useGetFinancierConfigs } from "~/hooks/use-financier-config";
import {
	getLowestInstallmentTier,
	calculateInstallmentPricing,
} from "~/components/employee/checkout/checkout-utils";

export interface ProductCardProps {
	product: Item | ItemWithRelation;
	variant?: "admin" | "employee" | "supplier" | "landing";
	onClick?: (product: Item | ItemWithRelation) => void;
	isEppEmployee?: boolean;
}

interface StatusBadgeProps {
	status: string;
	className?: string;
}

export const getStatusVariant = (status: string) => {
	switch (status.toUpperCase()) {
		case "APPROVED":
		case "ACTIVE":
			return "default";
		case "PENDING":
			return "secondary";
		case "REJECTED":
			return "destructive";
		default:
			return "outline";
	}
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
	return (
		<Badge
			variant={getStatusVariant(status)}
			className={`font-normal capitalize ${className}`.trim()}>
			{status.toLowerCase()}
		</Badge>
	);
}

export function ProductCard({ product, variant = "admin", onClick, isEppEmployee = false }: ProductCardProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const { data: configsData } = useGetFinancierConfigs();

	// Get images array, filter out nulls
	const images = (product.images?.filter((img) => img.url) || []) as { url?: string | null }[];
	const hasMultipleImages = images.length > 1;

	const currentImage = images[currentImageIndex]?.url || product.imageUrl;

	const handlePrevImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNextImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	if (variant === "employee" || variant === "landing") {
		const tiers = configsData?.financierConfigs?.[0]?.installmentRateConfig || [];
		const priceToUse = product.costPrice || product.retailPrice;
		const lowestTierCount = getLowestInstallmentTier(priceToUse, tiers);
		const lowestTier = tiers.find((t) => t.installmentCount === lowestTierCount);
		const { perInstallment: monthlyPayment } = lowestTier
			? calculateInstallmentPricing(priceToUse, lowestTier.installmentCount, lowestTier.rate)
			: { perInstallment: 0 };
		const installmentCount = lowestTier?.installmentCount ?? 0;

		if (variant === "landing") {
			return (
				<div className="group cursor-pointer space-y-3">
					<div className="relative aspect-square overflow-hidden rounded-xl bg-muted/20">
						{currentImage ? (
							<img
								src={currentImage}
								alt={product.name}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<Package className="h-12 w-12 text-muted-foreground/20" />
							</div>
						)}
						{/* Image Navigation */}
						{hasMultipleImages && (
							<>
								<Button
									type="button"
									variant="secondary"
									size="icon"
									className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
									onClick={handlePrevImage}>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									type="button"
									variant="secondary"
									size="icon"
									className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
									onClick={handleNextImage}>
									<ChevronRight className="h-4 w-4" />
								</Button>
								{/* Dots indicator */}
								<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
									{images.map((_, index) => (
										<div
											key={index}
											className={`h-1.5 w-1.5 rounded-full transition-all shadow-sm ${
												index === currentImageIndex
													? "bg-white scale-110"
													: "bg-white/60"
											}`}
										/>
									))}
								</div>
							</>
						)}
					</div>

					<div className="flex justify-between items-start gap-4">
						<div className="flex flex-col gap-1">
							<h3
								className="font-semibold text-base leading-tight group-hover:underline decoration-1 underline-offset-2"
								title={product.name}>
								{product.name}
							</h3>
							{isEppEmployee && (
								<p className="text-sm text-muted-foreground">
									₱{Math.round(monthlyPayment).toLocaleString()}/mo • {installmentCount} mos
								</p>
							)}
						</div>
						<div className="flex flex-col items-end shrink-0">
							<span className="font-bold text-base">
								₱{(product.costPrice || product.retailPrice).toLocaleString()}
							</span>
							{product.costPrice && product.costPrice < product.retailPrice && (
								<span className="text-xs text-muted-foreground line-through">
									₱{product.retailPrice.toLocaleString()}
								</span>
							)}
						</div>
					</div>
				</div>
			);
		}

		return (
			<Card className="group overflow-hidden border-border/40 bg-card/50 transition-all hover:bg-card hover:shadow-sm py-0 gap-0">
				<div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
					{currentImage ? (
						<img
							src={currentImage}
							alt={product.name}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<Package className="h-12 w-12 text-muted-foreground/20" />
						</div>
					)}
					{/* Image Navigation */}
					{hasMultipleImages && (
						
						<>
							<Button
								type="button"
								variant="secondary"
								size="icon"
								className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={handlePrevImage}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="secondary"
								size="icon"
								className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={handleNextImage}>
								<ChevronRight className="h-4 w-4" />
							</Button>
							{/* Dots indicator */}
							<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
								{images.map((_, index) => (
									<div
										key={index}
										className={`h-1.5 w-1.5 rounded-full transition-colors ${
											index === currentImageIndex ? "bg-white" : "bg-white/50"
										}`}
									/>
								))}
							</div>
						</>
					)}
				</div>
				<div className="flex justify-between items-start p-4">
					<div className="flex flex-col gap-1 pt-1">
						<h3
							className="line-clamp-1 font-medium leading-none tracking-tight"
							title={product.name}>
							{product.name}
						</h3>
					</div>
					<div className="flex flex-col items-end shrink-0">
						{isEppEmployee ? (
							<>
								<span className="font-bold text-primary">
									₱{Math.round(monthlyPayment).toLocaleString()}
								</span>
								<span className="text-[11px] text-muted-foreground whitespace-nowrap">per installment</span>
							</>
						) : (
							<>
								<span className="font-bold text-primary">
									₱{(product.costPrice || product.retailPrice).toLocaleString()}
								</span>
								{product.costPrice && product.costPrice < product.retailPrice && (
									<span className="text-[11px] text-gray-400 line-through">
										₱{product.retailPrice.toLocaleString()}
									</span>
								)}
							</>
						)}
					</div>
				</div>
			</Card>
		);
	}

	// Admin/supplier variant (default)
	return (
		<Card
			className="group overflow-hidden border-border/40 bg-card/50 transition-all hover:bg-card hover:shadow-sm py-0 gap-0 cursor-pointer"
			onClick={(e) => {
				e.stopPropagation();
				onClick?.(product);
			}}>
			<div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
				{currentImage ? (
					<img
						src={currentImage}
						alt={product.name}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Package className="h-12 w-12 text-muted-foreground/20" />
					</div>
				)}
				{/* Image Navigation */}
				{hasMultipleImages && (
					<>
						<Button
							type="button"
							variant="secondary"
							size="icon"
							className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={handlePrevImage}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={handleNextImage}>
							<ChevronRight className="h-4 w-4" />
						</Button>
						{/* Dots indicator */}
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
							{images.map((_, index) => (
								<div
									key={index}
									className={`h-1.5 w-1.5 rounded-full transition-colors ${
										index === currentImageIndex ? "bg-white" : "bg-white/50"
									}`}
								/>
							))}
						</div>
					</>
				)}
				{/* Actions Menu */}
				{/* <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="secondary"
								size="icon"
								className="h-8 w-8 bg-background/80 backdrop-blur-sm">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem>
								<Edit className="mr-2 h-4 w-4" /> Edit Details
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ArchiveRestore className="mr-2 h-4 w-4" /> Update Stock
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								<Archive className="mr-2 h-4 w-4" /> Archive Product
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div> */}
				{/* Status Badge */}
				<div className="absolute left-2 top-2">
					<StatusBadge status={product.status} className="backdrop-blur-sm" />
				</div>
			</div>
			<div className="p-4">
				<div className="mb-2 flex items-start justify-between gap-2">
					<h3
						className="line-clamp-1 font-medium leading-none tracking-tight"
						title={product.name}>
						{product.name}
					</h3>
					<span className="shrink-0 font-semibold text-sm">
						₱{product.retailPrice.toLocaleString()}
					</span>
				</div>
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>{product.sku || ""}</span>
					<span className={product.stockQuantity > 0 ? "" : "text-destructive"}>
						{product.stockQuantity > 0
							? `${product.stockQuantity} in stock`
							: "Out of stock"}
					</span>
				</div>
			</div>
		</Card>
	);
}

