import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export function CartError() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<Card className="max-w-md w-full">
				<CardContent className="pt-6 text-center">
					<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
						<Package className="h-8 w-8 text-destructive" />
					</div>
					<h3 className="font-semibold text-xl mb-2">Failed to load cart</h3>
					<p className="text-muted-foreground mb-4">
						Something went wrong. Please try again later.
					</p>
					<Button variant="outline" asChild>
						<Link to="/employee/catalog">Continue Shopping</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
