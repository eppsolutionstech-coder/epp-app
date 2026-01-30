import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
	totalItemCount: number;
}

export function CartHeader({ totalItemCount }: CartHeaderProps) {
	return (
		<div className="flex items-center gap-4">
			<Button variant="ghost" size="icon" className="rounded-full" asChild>
				<Link to="/employee">
					<ArrowLeft className="h-5 w-5" />
				</Link>
			</Button>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Shopping Cart</h1>
				<p className="text-muted-foreground">
					{totalItemCount} {totalItemCount === 1 ? "item" : "items"} in your cart
				</p>
			</div>
		</div>
	);
}
