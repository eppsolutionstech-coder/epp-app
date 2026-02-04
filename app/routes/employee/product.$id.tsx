import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Loader2, ShoppingCart } from "lucide-react";
import { useGetItemById } from "~/hooks/use-item";
import { useCreateCartItem } from "~/hooks/use-cart-item";
import type { ItemImage } from "~/zod/item.zod";
import { useAuth } from "~/hooks/use-auth";
import {
	FloatingCartBubbles,
	ProductImageGallery,
	ProductHeader,
	ProductPricing,
	InstallmentOptions,
	TrustBadges,
	ProductSpecifications,
	type FloatingBubble,
} from "~/components/employee/product";

export default function EmployeeProductDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedInstallment, setSelectedInstallment] = useState(6);
	const { user } = useAuth();
	const { mutate: createCartItem, isPending: isAddingToCart } = useCreateCartItem();

	// Floating bubble state
	const [floatingBubbles, setFloatingBubbles] = useState<FloatingBubble[]>([]);
	const addToCartButtonRef = useRef<HTMLButtonElement>(null);
	const bubbleIdRef = useRef(0);

	const {
		data: item,
		isLoading,
		isError,
	} = useGetItemById(id!, {
		fields: "id, sku, name, status, description, category.name, supplier.name, retailPrice, costPrice, stockQuantity, lowStockThreshold, images, specifications, isActive, isFeatured, isAvailable, createdAt, updatedAt",
	});

	const images = item?.images?.filter((img: ItemImage) => img.url) || [];

	const handleBuyNow = () => {
		if (!item) return;

		const coverImage = item.images?.find((img: ItemImage) => img.type === "COVER");
		const imageUrl = coverImage?.url || item.images?.[0]?.url || "/placeholder.png";

		const checkoutItem = {
			itemId: item.id,
			productName: item.name,
			productSku: item.sku,
			productImage: imageUrl,
			costPrice: Number(item.costPrice),
			retailPrice: Number(item.retailPrice),
			quantity: 1,
		};

		navigate("/employee/checkout", {
			state: { items: [checkoutItem], source: "direct" },
		});
	};

	const triggerFloatingBubble = useCallback((imageUrl: string) => {
		if (!addToCartButtonRef.current) return;

		const buttonRect = addToCartButtonRef.current.getBoundingClientRect();
		const startX = buttonRect.left + buttonRect.width / 2;
		const startY = buttonRect.top + buttonRect.height / 2;

		// Target: top-right corner (cart icon position - responsive)
		const screenWidth = window.innerWidth;
		const rightOffset = screenWidth * 0.23;
		const topOffset = 20;

		const targetX = screenWidth - rightOffset - startX;
		const targetY = topOffset - startY;

		const newBubble: FloatingBubble = {
			id: bubbleIdRef.current++,
			startX,
			startY,
			targetX,
			targetY,
			imageUrl,
		};

		setFloatingBubbles((prev) => [...prev, newBubble]);

		setTimeout(() => {
			setFloatingBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
		}, 800);
	}, []);

	const handleAddToCart = () => {
		if (!user?.id || !item?.id) return;

		const currentImage = images[currentImageIndex]?.url || "/placeholder.png";
		triggerFloatingBubble(currentImage);

		createCartItem({
			employeeId: user.id,
			itemId: item.id,
			quantity: 1,
		});
	};

	const handlePrevImage = () => {
		if (!images.length) return;
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		if (!images.length) return;
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// Error state
	if (isError || !item) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
				<Package className="h-16 w-16 text-muted-foreground/30" />
				<h2 className="text-xl font-semibold">Item not found</h2>
				<p className="text-muted-foreground">
					The item you're looking for doesn't exist or has been removed.
				</p>
				<Button onClick={() => navigate(-1)}>Go Back</Button>
			</div>
		);
	}

	const costPrice = Number(item.costPrice);
	const retailPrice = Number(item.retailPrice);

	return (
		<>
			<FloatingCartBubbles bubbles={floatingBubbles} />

			<div className="max-w-6xl mx-auto px-4 py-6">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
					<Link
						to="/employee/catalog"
						className="hover:text-foreground transition-colors">
						Catalog
					</Link>
					<span>/</span>
					<span className="text-foreground">{item.name}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					{/* Image Gallery */}
					<ProductImageGallery
						images={images}
						productName={item.name}
						currentImageIndex={currentImageIndex}
						onImageChange={setCurrentImageIndex}
						onPrevImage={handlePrevImage}
						onNextImage={handleNextImage}
					/>

					{/* Product Info */}
					<div className="space-y-6">
						<ProductHeader
							name={item.name}
							supplierName={(item as any).supplier?.name}
							categoryName={(item as any).category?.name}
							stockQuantity={item.stockQuantity}
						/>

						<Separator />

						<ProductPricing costPrice={costPrice} retailPrice={retailPrice} />

						<InstallmentOptions
							costPrice={costPrice}
							selectedInstallment={selectedInstallment}
							onSelectInstallment={setSelectedInstallment}
						/>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<Button
								size="lg"
								className="flex-3 h-12 text-base cursor-pointer"
								onClick={handleBuyNow}>
								Order Now
							</Button>
							<Button
								ref={addToCartButtonRef}
								size="lg"
								variant="outline"
								className="flex-1 h-12 text-base cursor-pointer"
								onClick={handleAddToCart}
								disabled={isAddingToCart}>
								{isAddingToCart ? (
									<Loader2 className="h-5 w-5 mr-2 animate-spin" />
								) : (
									<ShoppingCart className="h-5 w-5 mr-2" />
								)}
							</Button>
						</div>

						<TrustBadges />

						<Separator />

						{/* Description */}
						<div className="space-y-3">
							<h3 className="font-medium">About this item</h3>
							<p className="text-muted-foreground leading-relaxed">
								{item.description || "No description available for this item."}
							</p>
						</div>

						<ProductSpecifications specifications={item.specifications || {}} />
					</div>
				</div>
			</div>
		</>
	);
}

