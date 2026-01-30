import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export function CartEmpty() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<Card className="max-w-md w-full border-dashed">
				<CardContent className="pt-8 pb-8 text-center">
					<div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
						<ShoppingBag className="h-10 w-10 text-muted-foreground" />
					</div>
					<h3 className="font-semibold text-2xl mb-2">Your cart is empty</h3>
					<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
						Looks like you haven't added any items to your cart yet. Start exploring our
						catalog!
					</p>
					<Button asChild size="lg" className="rounded-full px-8">
						<Link to="/employee">Browse Products</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
