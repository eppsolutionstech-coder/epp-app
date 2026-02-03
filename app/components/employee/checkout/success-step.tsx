import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartyPopper, Truck, Shield } from "lucide-react";

interface SuccessStepProps {
	orderNumber?: string;
}

export function SuccessStep({ orderNumber }: SuccessStepProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6 sm:p-8">
				<div className="text-center py-8 space-y-6">
					<div className="relative">
						<div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto animate-bounce">
							<PartyPopper className="h-12 w-12 text-green-600 dark:text-green-400" />
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
						<p className="text-muted-foreground mt-2 max-w-md mx-auto">
							Your order has been submitted for approval. You'll receive a
							confirmation email shortly.
						</p>
					</div>

					<div className="bg-muted/50 rounded-xl p-6 inline-block">
						<p className="text-sm text-muted-foreground mb-1">Order Reference</p>
						<p className="text-2xl font-mono font-bold tracking-wider">
							{orderNumber || "Processing..."}
						</p>
					</div>

					{/* Order Benefits */}
					<div className="flex justify-center gap-6 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Truck className="h-4 w-4" />
							<span>Fast Delivery</span>
						</div>
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							<span>Warranty Included</span>
						</div>
					</div>

					<div className="flex gap-4 justify-center pt-4">
						<Button variant="outline" size="lg" className="rounded-full" asChild>
							<Link to="/employee/profile/orders" replace>
								View My Orders
							</Link>
						</Button>
						<Button size="lg" className="rounded-full" asChild>
							<Link to="/employee" replace>
								Continue Shopping
							</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
