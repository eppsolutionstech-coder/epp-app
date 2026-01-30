import { ShoppingCart } from "lucide-react";

// Floating bubble animation styles
export const floatingBubbleStyles = `
@keyframes floatToCart {
	0% {
		transform: translate(0, 0) scale(1);
		opacity: 1;
	}
	100% {
		transform: translate(var(--target-x), var(--target-y)) scale(0.3);
		opacity: 0;
	}
}
`;

export interface FloatingBubble {
	id: number;
	startX: number;
	startY: number;
	targetX: number;
	targetY: number;
	imageUrl: string;
}

interface FloatingCartBubblesProps {
	bubbles: FloatingBubble[];
}

export function FloatingCartBubbles({ bubbles }: FloatingCartBubblesProps) {
	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: floatingBubbleStyles }} />
			{bubbles.map((bubble) => (
				<div
					key={bubble.id}
					className="fixed pointer-events-none z-[9999]"
					style={
						{
							left: bubble.startX,
							top: bubble.startY,
							"--target-x": `${bubble.targetX}px`,
							"--target-y": `${bubble.targetY}px`,
							animation: "floatToCart 700ms cubic-bezier(0.32, 0, 0.67, 0) forwards",
						} as React.CSSProperties
					}>
					<div className="relative -translate-x-1/2 -translate-y-1/2">
						<div className="h-16 w-16 rounded-full bg-white shadow-xl overflow-hidden ring-4 ring-primary/20">
							<img
								src={bubble.imageUrl}
								alt="Added to cart"
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
							<ShoppingCart className="h-3 w-3 text-white" />
						</div>
					</div>
				</div>
			))}
		</>
	);
}
