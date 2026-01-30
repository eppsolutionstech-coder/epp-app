import { Loader2 } from "lucide-react";

export function CartLoading() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-muted-foreground">Loading your cart...</p>
			</div>
		</div>
	);
}
