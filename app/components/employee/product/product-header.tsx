import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Check } from "lucide-react";

interface ProductHeaderProps {
	name: string;
	supplierName?: string;
	categoryName?: string;
	stockQuantity: number;
}

export function ProductHeader({
	name,
	supplierName = "EPP Store",
	categoryName = "General",
	stockQuantity,
}: ProductHeaderProps) {
	return (
		<div>
			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
				<span>{supplierName}</span>
				<span>â€¢</span>
				<span>{categoryName}</span>
			</div>
			<h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">{name}</h1>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{stockQuantity > 0 ? (
						<Badge variant="secondary" className="bg-green-50 text-green-700 border-0">
							<Check className="h-3 w-3 mr-1" />
							{stockQuantity} items in stock
						</Badge>
					) : (
						<Badge variant="destructive">Out of Stock</Badge>
					)}
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon" className="h-9 w-9">
						<Heart className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

