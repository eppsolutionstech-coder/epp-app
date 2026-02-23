import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Item, ItemImage } from "~/zod/item.zod";

interface ProductDetailsViewProps {
	product: Item | null | undefined;
	isLoading: boolean;
	isError: boolean;
	/** Optional header actions (e.g., Edit/Delete buttons for supplier) */
	headerActions?: React.ReactNode;
	/** Whether to show supplier info in additional details (for admin view) */
	showsupplierInfo?: boolean;
	/** Whether to show admin pricing block (cost/retailer/wholesale) */
	showAdminPriceSection?: boolean;
	/** Optional action shown in admin pricing section (e.g., Edit Prices button) */
	adminPriceAction?: React.ReactNode;
}

export function ProductDetailsView({
	product,
	isLoading,
	isError,
	headerActions,
	showsupplierInfo = false,
	showAdminPriceSection = false,
	adminPriceAction,
}: ProductDetailsViewProps) {
	const navigate = useNavigate();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handlePrevImage = () => {
		if (!product?.images?.length) return;
		setCurrentImageIndex((prev) => (prev === 0 ? product.images!.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		if (!product?.images?.length) return;
		setCurrentImageIndex((prev) => (prev === product.images!.length - 1 ? 0 : prev + 1));
	};

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

	const getSafePrice = (value: unknown) => {
		const parsedPrice = Number(value ?? 0);
		return Number.isFinite(parsedPrice) ? parsedPrice : 0;
	};

	const formatPrice = (value: unknown) => `\u20B1${getSafePrice(value).toLocaleString()}`;

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
				</div>
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		);
	}

	if (isError || !product) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
				</div>
				<div className="text-center py-16 text-muted-foreground">
					Failed to load product. Please try again.
				</div>
			</div>
		);
	}

	const images = product.images?.filter((img: ItemImage) => img.url) || [];
	const currentImage = images[currentImageIndex]?.url || product.imageUrl;
	const hasMultipleImages = images.length > 1;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
				</div>
				{headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				{/* Image Gallery */}
				<div className="sticky top-0 py-0">
					<div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
						{currentImage ? (
							<img
								src={currentImage}
								alt={product.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<Package className="h-24 w-24 text-muted-foreground/20" />
							</div>
						)}
						{/* Navigation Arrows */}
						{hasMultipleImages && (
							<>
								<Button
									type="button"
									variant="secondary"
									size="icon"
									className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={handlePrevImage}>
									<ChevronLeft className="h-5 w-5" />
								</Button>
								<Button
									type="button"
									variant="secondary"
									size="icon"
									className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={handleNextImage}>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</>
						)}
					</div>
					{/* Thumbnail Gallery */}
					{images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto py-2 hide-scrollbar">
							{images.map((img: ItemImage, index: number) => (
								<button
									key={index}
									type="button"
									className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-colors ${
										index === currentImageIndex
											? "border-primary"
											: "border-transparent hover:border-muted-foreground/50"
									}`}
									onClick={() => setCurrentImageIndex(index)}>
									<img
										src={img.url!}
										alt={`${product.name} - ${index + 1}`}
										className="h-full w-full object-cover"
									/>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Product Info */}
				<div className="space-y-3">
					{/* Product Information */}
					<Card>
						<CardHeader>
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
								<div>
									<CardTitle className="text-2xl">{product.name}</CardTitle>
									<p className="text-sm text-muted-foreground mt-1">
										SKU: {product.sku}
									</p>
								</div>
								<Badge
									variant={getStatusVariant(product.status)}
									className="capitalize w-fit mt-1">
									{product.status.toLowerCase()}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Stock Quantity</p>
									<p
										className={`text-lg font-medium ${
											product.stockQuantity < 10 ? "text-red-500" : ""
										}`}>
										{product.stockQuantity} units
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Low Stock Threshold
									</p>
									<p className="text-lg font-medium">
										{product.lowStockThreshold} units
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Price Settings */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between gap-2">
								<CardTitle>Price Settings</CardTitle>
								{showAdminPriceSection && adminPriceAction && (
									<div className="flex items-center gap-2">
										{adminPriceAction}
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Retail Price</p>
									<p className="text-2xl font-bold">
										{formatPrice(product.retailPrice)}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Selling Price</p>
									<p className="text-2xl font-bold text-primary">
										{formatPrice(product.sellingPrice)}
									</p>
								</div>
							</div>

							{showAdminPriceSection && (
								<>
									<Separator />
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<div>
											<p className="text-sm text-muted-foreground">
												Cost Price
											</p>
											<p className="text-lg font-semibold">
												{formatPrice(product.costPrice)}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Retailer Price
											</p>
											<p className="text-lg font-semibold">
												{formatPrice(product.retailerPrice)}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												Wholesale Price
											</p>
											<p className="text-lg font-semibold">
												{formatPrice(product.wholeSalePrice)}
											</p>
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Description */}
					<Card>
						<CardHeader>
							<CardTitle>Description</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								{product.description || "No description provided."}
							</p>
						</CardContent>
					</Card>

					{/* Additional Details & Specifications Accordions */}
					<Accordion type="multiple" className="space-y-3 pb-4">
						{/* Additional Details */}
						<AccordionItem
							value="additional-details"
							className="border rounded-lg bg-card px-4">
							<AccordionTrigger className="text-base font-semibold hover:no-underline border-none">
								Additional Details
							</AccordionTrigger>
							<AccordionContent className="space-y-3 pt-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Category</span>
									<span className="font-medium">
										{(product as any).category?.name || "Uncategorized"}
									</span>
								</div>
								{showsupplierInfo && (
									<>
										<Separator />
										<div className="flex justify-between">
											<span className="text-muted-foreground">supplier</span>
											<span className="font-medium">
												{(product as any).supplier?.name || "Unknown"}
											</span>
										</div>
									</>
								)}
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground">Active</span>
									<Badge variant={product.isActive ? "default" : "secondary"}>
										{product.isActive ? "Yes" : "No"}
									</Badge>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground">Featured</span>
									<Badge variant={product.isFeatured ? "default" : "secondary"}>
										{product.isFeatured ? "Yes" : "No"}
									</Badge>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-muted-foreground">Available</span>
									<Badge variant={product.isAvailable ? "default" : "secondary"}>
										{product.isAvailable ? "Yes" : "No"}
									</Badge>
								</div>
								{product.createdAt && (
									<>
										<Separator />
										<div className="flex justify-between">
											<span className="text-muted-foreground">Created</span>
											<span className="font-medium">
												{new Date(product.createdAt).toLocaleDateString()}
											</span>
										</div>
									</>
								)}
								{product.updatedAt && (
									<>
										<Separator />
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Last Updated
											</span>
											<span className="font-medium">
												{new Date(product.updatedAt).toLocaleDateString()}
											</span>
										</div>
									</>
								)}
							</AccordionContent>
						</AccordionItem>

						{/* Specifications */}
						{product.specifications &&
							Object.keys(product.specifications).length > 0 && (
								<AccordionItem
									value="specifications"
									className="border rounded-lg bg-card px-4">
									<AccordionTrigger className="text-base font-semibold hover:no-underline">
										Specifications
									</AccordionTrigger>
									<AccordionContent className="space-y-4 pt-2">
										{Object.entries(product.specifications).map(
											([key, value], index) => {
												const isArray = Array.isArray(value);
												return (
													<div key={key}>
														{index > 0 && (
															<Separator className="my-4" />
														)}
														<div className="space-y-2">
															<h4 className="font-medium capitalize text-sm">
																{key.replace(/_/g, " ")}
															</h4>
															{isArray ? (
																<ul className="list-disc list-inside space-y-1 text-muted-foreground">
																	{(value as string[]).map(
																		(item, i) => (
																			<li
																				key={i}
																				className="text-sm">
																				{item}
																			</li>
																		),
																	)}
																</ul>
															) : typeof value === "object" &&
															  value !== null ? (
																<div className="space-y-1 text-sm text-muted-foreground">
																	{Object.entries(value).map(
																		([subKey, subValue]) => (
																			<div
																				key={subKey}
																				className="flex justify-between">
																				<span className="capitalize">
																					{subKey.replace(
																						/_/g,
																						" ",
																					)}
																				</span>
																				<span className="font-medium">
																					{String(
																						subValue,
																					)}
																				</span>
																			</div>
																		),
																	)}
																</div>
															) : (
																<p className="text-sm text-muted-foreground">
																	{String(value)}
																</p>
															)}
														</div>
													</div>
												);
											},
										)}
									</AccordionContent>
								</AccordionItem>
							)}
					</Accordion>
				</div>
			</div>
		</div>
	);
}
