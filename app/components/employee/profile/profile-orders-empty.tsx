import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileOrdersEmpty() {
	return (
		<Card className="border-dashed">
			<CardContent className="py-10 text-center">
				<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
					<ShoppingBag className="h-8 w-8 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold mb-2">No orders yet</h3>
				<p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
					You have not placed any order yet. Browse the catalog to get started.
				</p>
				<Button asChild>
					<Link to="/employee/catalog">Browse Catalog</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
