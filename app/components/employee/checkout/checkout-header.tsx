import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CheckoutHeaderProps {
	showBackButton: boolean;
	onBack: () => void;
}

export function CheckoutHeader({ showBackButton, onBack }: CheckoutHeaderProps) {
	return (
		<div className="flex items-center gap-4">
			{showBackButton && (
				<Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
			)}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
				<p className="text-muted-foreground">Complete your EPP purchase</p>
			</div>
		</div>
	);
}
