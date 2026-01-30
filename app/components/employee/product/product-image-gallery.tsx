import { Button } from "@/components/ui/button";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { ItemImage } from "~/zod/item.zod";

interface ProductImageGalleryProps {
	images: ItemImage[];
	productName: string;
	currentImageIndex: number;
	onImageChange: (index: number) => void;
	onPrevImage: () => void;
	onNextImage: () => void;
}

export function ProductImageGallery({
	images,
	productName,
	currentImageIndex,
	onImageChange,
	onPrevImage,
	onNextImage,
}: ProductImageGalleryProps) {
	const currentImage = images[currentImageIndex]?.url;
	const hasMultipleImages = images.length > 1;

	return (
		<div className="space-y-2 lg:sticky lg:top-0 lg:self-start">
			{/* Main Image */}
			<div className="relative aspect-square bg-muted/30 rounded-2xl overflow-hidden group">
				{currentImage ? (
					<img
						src={currentImage}
						alt={productName}
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
							className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
							onClick={onPrevImage}>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
							onClick={onNextImage}>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</>
				)}

				{/* Image Counter */}
				{hasMultipleImages && (
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
						{currentImageIndex + 1} / {images.length}
					</div>
				)}
			</div>

			{/* Thumbnail Gallery */}
			{hasMultipleImages && (
				<div className="flex gap-3 overflow-x-auto p-1">
					{images.map((img, index) => (
						<button
							key={index}
							type="button"
							className={`flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden transition-all ${
								index === currentImageIndex
									? "ring-2 ring-primary ring-offset-2"
									: "opacity-60 hover:opacity-100"
							}`}
							onClick={() => onImageChange(index)}>
							<img
								src={img.url!}
								alt={`${productName} - ${index + 1}`}
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
