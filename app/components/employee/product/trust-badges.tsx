import { Truck, Shield } from "lucide-react";

export function TrustBadges() {
	return (
		<div className="grid grid-cols-2 gap-4 pt-2">
			<div className="flex items-center gap-3 text-sm">
				<div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
					<Truck className="h-5 w-5 text-muted-foreground" />
				</div>
				<div>
					<p className="font-medium">Free Delivery</p>
					<p className="text-xs text-muted-foreground">To your office</p>
				</div>
			</div>
			<div className="flex items-center gap-3 text-sm">
				<div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
					<Shield className="h-5 w-5 text-muted-foreground" />
				</div>
				<div>
					<p className="font-medium">Warranty</p>
					<p className="text-xs text-muted-foreground">1 year coverage</p>
				</div>
			</div>
		</div>
	);
}
