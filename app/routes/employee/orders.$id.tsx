import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	Calendar,
	CreditCard,
	MapPin,
	Package,
	Printer,
	ShoppingBag,
	Truck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for the order details
const MOCK_ORDER = {
	id: "69787c6951f10f46a05d4202",
	orderNumber: "ORD-20260127-A0001",
	status: "PENDING_APPROVAL",
	orderDate: "2026-01-27T08:50:49.239Z",
	paymentType: "INSTALLMENT",
	paymentMethod: "PAYROLL_DEDUCTION",
	installmentMonths: 6,
	installmentCount: 12, // Total cutoffs
	installmentAmount: 1339.25,
	subtotal: 14610,
	tax: 1461,
	total: 16071,
	shippingAddress: {
		street: "123 Innovation Drive",
		city: "Makati City",
		province: "Metro Manila",
		zipCode: "1200",
	},
	items: [
		{
			id: "1",
			name: "Ergonomic Office Chair",
			sku: "CH-001",
			price: 8500,
			quantity: 1,
			total: 8500,
			image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
		},
		{
			id: "2",
			name: "Wireless Mechanical Keyboard",
			sku: "KB-045",
			price: 3500,
			quantity: 1,
			total: 3500,
			image: "https://images.unsplash.com/photo-1587829741301-356364971915?q=80&w=1000&auto=format&fit=crop",
		},
		{
			id: "3",
			name: "USB-C Hub Multiport Adapter",
			sku: "AC-102",
			price: 2610,
			quantity: 1,
			total: 2610,
			image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=1000&auto=format&fit=crop",
		},
	],
	installments: Array(12)
		.fill(null)
		.map((_, i) => ({
			cutoffDate: new Date(2026, 1 + Math.floor(i / 2), i % 2 === 0 ? 15 : 30).toISOString(),
			amount: 1339.25,
			status: "PENDING",
		})),
	timeline: [
		{
			date: "2026-01-27T08:50:49.239Z",
			title: "Order Placed",
			description: "Order has been created and is pending approval.",
		},
	],
};

export default function OrderDetailsPage() {
	const { id } = useParams();
	// In a real implementation, we would fetch data based on `id`
	const order = MOCK_ORDER;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const paidInstallments = order.installments.filter((i) => i.status === "PAID").length;
	const progress = (paidInstallments / order.installmentCount) * 100;

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link to="/employee/profile?tab=orders">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold flex items-center gap-3">
							Order {order.orderNumber}
							<Badge variant={order.status === "COMPLETED" ? "default" : "secondary"}>
								{order.status.replace("_", " ")}
							</Badge>
						</h1>
						<p className="text-muted-foreground">
							Placed on {formatDate(order.orderDate)}
						</p>
					</div>
				</div>
				<Button variant="outline" className="gap-2">
					<Printer className="h-4 w-4" />
					Print Invoice
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Left Column - Details */}
				<div className="lg:col-span-2 space-y-8">
					{/* Progress Section (if installment) */}
					{order.paymentType === "INSTALLMENT" && (
						<Card>
							<CardHeader>
								<CardTitle className="flex justify-between items-center text-base">
									<span>Payment Progress</span>
									<span className="text-sm font-normal text-muted-foreground">
										{paidInstallments} of {order.installmentCount} payments made
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Progress value={progress} className="h-3 w-full" />
								<div className="mt-4 grid grid-cols-2 gap-4">
									<div className="bg-muted/50 p-3 rounded-lg">
										<p className="text-xs text-muted-foreground">
											Monthly Deduction
										</p>
										<p className="font-semibold text-lg">
											{formatCurrency(order.installmentAmount)}
										</p>
									</div>
									<div className="bg-muted/50 p-3 rounded-lg">
										<p className="text-xs text-muted-foreground">Total Paid</p>
										<p className="font-semibold text-lg text-primary">
											{formatCurrency(
												paidInstallments * order.installmentAmount,
											)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle>Items ({order.items.length})</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y">
								{order.items.map((item) => (
									<div key={item.id} className="flex gap-4 p-6">
										<div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0 border">
											<img
												src={item.image}
												alt={item.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start gap-4">
												<div>
													<h4 className="font-semibold line-clamp-2">
														{item.name}
													</h4>
													<p className="text-sm text-muted-foreground mt-1">
														SKU: {item.sku}
													</p>
												</div>
												<p className="font-semibold">
													{formatCurrency(item.total)}
												</p>
											</div>
											<div className="mt-2 text-sm text-muted-foreground">
												Qty: {item.quantity} × {formatCurrency(item.price)}
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Shipping Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Truck className="h-5 w-5 text-primary" />
								Order Status
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6 relative pl-4 border-l-2 border-muted ml-2">
								{order.timeline.map((event, index) => (
									<div key={index} className="relative">
										<div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
										<div className="space-y-1">
											<p className="font-medium text-sm">{event.title}</p>
											<p className="text-xs text-muted-foreground">
												{new Date(event.date).toLocaleString()}
											</p>
											<p className="text-sm text-muted-foreground">
												{event.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Summary */}
				<div className="space-y-8">
					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatCurrency(order.subtotal)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Tax</span>
								<span>{formatCurrency(order.tax)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>Free</span>
							</div>
							<Separator />
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>{formatCurrency(order.total)}</span>
							</div>
						</CardContent>
					</Card>

					{/* Delivery Address */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Shipping Address
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-1">
							<p>Juan Dela Cruz (Employee)</p>
							<p>{order.shippingAddress.street}</p>
							<p>
								{order.shippingAddress.city}, {order.shippingAddress.province}
							</p>
							<p>{order.shippingAddress.zipCode}</p>
						</CardContent>
					</Card>

					{/* Payment Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<CreditCard className="h-4 w-4" />
								Payment Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-xs font-medium text-muted-foreground uppercase mb-1">
									Payment Method
								</p>
								<p className="text-sm font-medium">Payroll Deduction</p>
							</div>
							<div>
								<p className="text-xs font-medium text-muted-foreground uppercase mb-1">
									Payment Type
								</p>
								<Badge variant="outline">{order.paymentType}</Badge>
							</div>
							{order.paymentType === "INSTALLMENT" && (
								<div>
									<p className="text-xs font-medium text-muted-foreground uppercase mb-1">
										Terms
									</p>
									<p className="text-sm">
										{order.installmentMonths} Months ({order.installmentCount}{" "}
										Cutoffs)
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Need Help? */}
					<Card className="bg-muted/50 border-dashed">
						<CardContent className="p-6 text-center space-y-2">
							<Package className="h-8 w-8 mx-auto text-muted-foreground" />
							<h4 className="font-semibold text-sm">Need help with your order?</h4>
							<p className="text-xs text-muted-foreground">
								Contact HR or support for assistance regarding this order.
							</p>
							<Button variant="link" size="sm" className="text-primary h-auto p-0">
								Contact Support
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
