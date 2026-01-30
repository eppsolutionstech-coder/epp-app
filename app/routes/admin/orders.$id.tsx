import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	CreditCard,
	MapPin,
	Package,
	Printer,
	Truck,
	User,
	CheckCircle,
	XCircle,
	ArrowRight,
	Calendar,
	Mail,
	Building,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for the order details
const MOCK_ORDER_DETAILS = {
	id: "69787c6951f10f46a05d4202",
	orderNumber: "ORD-20260127-A0001",
	employeeId: "EMP-001",
	status: "PENDING_APPROVAL",
	orderDate: "2026-01-27T08:50:49.239Z",
	paymentType: "INSTALLMENT",
	paymentMethod: "PAYROLL_DEDUCTION",
	installmentMonths: 6,
	installmentCount: 12,
	installmentAmount: 1339.25,
	subtotal: 14610,
	tax: 1461,
	total: 16071,
	employee: {
		id: "EMP-001",
		firstName: "Alice",
		lastName: "Johnson",
		username: "alice.j",
		email: "alice.j@techcorp.com",
	},
	shippingAddress: {
		street: "123 Innovation Drive",
		city: "Makati City",
		province: "Metro Manila",
		zipCode: "1200",
	},
	orderItems: [
		{
			id: "1",
			item: {
				name: "Ergonomic Office Chair",
				sku: "CH-001",
				images: [
					{
						url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
					},
				],
			},
			unitPrice: 8500,
			quantity: 1,
			subtotal: 8500,
		},
		{
			id: "2",
			item: {
				name: "Wireless Mechanical Keyboard",
				sku: "KB-045",
				images: [
					{
						url: "https://images.unsplash.com/photo-1587829741301-356364971915?q=80&w=1000&auto=format&fit=crop",
					},
				],
			},
			unitPrice: 3500,
			quantity: 1,
			subtotal: 3500,
		},
		{
			id: "3",
			item: {
				name: "USB-C Hub Multiport Adapter",
				sku: "AC-102",
				images: [
					{
						url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=1000&auto=format&fit=crop",
					},
				],
			},
			unitPrice: 2610,
			quantity: 1,
			subtotal: 2610,
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

export default function AdminOrderDetailsPage() {
	const { id } = useParams();

	// Using mock data as requested
	const order = MOCK_ORDER_DETAILS;
	const isLoading = false;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING_APPROVAL":
				return "bg-yellow-500 hover:bg-yellow-600";
			case "APPROVED":
				return "bg-emerald-500 hover:bg-emerald-600";
			case "PROCESSING":
				return "bg-purple-500 hover:bg-purple-600";
			case "SHIPPED":
				return "bg-indigo-500 hover:bg-indigo-600";
			case "DELIVERED":
				return "bg-green-500 hover:bg-green-600";
			case "CANCELLED":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-gray-500 hover:bg-gray-600";
		}
	};

	const handleStatusUpdate = (newStatus: string) => {
		// In a real app, this would be a mutation
		toast.success(`Order marked as ${newStatus}`);
	};

	const TimelineItem = ({
		title,
		date,
		description,
		isActive,
		isCompleted,
	}: {
		title: string;
		date?: string;
		description: string;
		isActive?: boolean;
		isCompleted?: boolean;
	}) => (
		<div className="relative pl-6 pb-6 last:pb-0 group">
			{/* Line */}
			<div className="absolute left-[9px] top-3 h-full w-0.5 bg-muted group-last:hidden" />

			{/* Dot */}
			<div
				className={cn(
					"absolute left-0 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors z-10",
					isCompleted
						? "bg-primary border-primary text-primary-foreground"
						: isActive
							? "border-primary bg-background text-primary"
							: "border-muted bg-muted text-muted-foreground",
				)}>
				{isCompleted ? (
					<CheckCircle className="h-3 w-3" />
				) : (
					<div className="h-1.5 w-1.5 rounded-full bg-current" />
				)}
			</div>

			<div className="space-y-1">
				<p className={cn("text-sm font-medium leading-none", isActive && "text-primary")}>
					{title}
				</p>
				{date && <p className="text-xs text-muted-foreground">{date}</p>}
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center py-12 gap-4">
				<h1 className="text-2xl font-bold">Order Not Found</h1>
				<p className="text-muted-foreground">
					The order you are looking for does not exist.
				</p>
				<Button asChild>
					<Link to="/admin/orders">Back to Orders</Link>
				</Button>
			</div>
		);
	}

	// Determine lifecycle state for UI
	const isPending = order.status === "PENDING_APPROVAL";
	const isApproved = order.status === "APPROVED";
	const isProcessing = order.status === "PROCESSING";
	const isShipped = order.status === "SHIPPED";
	const isDelivered = order.status === "DELIVERED";
	const isCancelled = order.status === "CANCELLED";

	const orderItems = order.orderItems || [];

	// Header Component
	const PageHeader = () => (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					asChild
					className="h-10 w-10 rounded-full hover:bg-muted/50 transition-colors">
					<Link to="/admin/orders">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-3">
						Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
					</h1>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Calendar className="h-3.5 w-3.5" />
						<span>Placed on {new Date(order.orderDate).toLocaleDateString()}</span>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" className="gap-2 rounded-full h-9">
					<Printer className="h-4 w-4" />
					Print Slip
				</Button>
			</div>
		</div>
	);

	const getEmployeeName = () => {
		if (order.employee?.firstName && order.employee?.lastName) {
			return `${order.employee.firstName} ${order.employee.lastName}`;
		}
		return order.employee?.username || order.employeeId || "Unknown Customer";
	};

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
			<PageHeader />

			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* MAIN CONTENT - Left Side (8 cols) */}
				<div className="md:col-span-8 flex flex-col gap-6">
					{/* ORDER ITEMS LIST */}
					<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
						<CardHeader>
							<CardTitle>Items ({orderItems.length})</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y">
								{orderItems.map((item: any) => (
									<div key={item.id || item.itemId} className="flex gap-4 p-6">
										<div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0 border relative">
											{item.item?.images?.[0]?.url ? (
												<img
													src={item.item.images[0].url}
													alt={item.item.name}
													className="h-full w-full object-cover"
												/>
											) : (
												<div className="h-full w-full flex items-center justify-center">
													<Package className="h-8 w-8 text-muted-foreground/30" />
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start gap-4">
												<div>
													<h4 className="font-semibold text-foreground/90 line-clamp-2">
														{item.item?.name || "Product Name"}
													</h4>
													<p className="text-sm text-muted-foreground mt-1">
														SKU: {item.item?.sku || "N/A"}
													</p>
													<div className="flex items-center gap-2 mt-2">
														<Badge
															variant="secondary"
															className="text-xs">
															Qty: {item.quantity}
														</Badge>
													</div>
												</div>
												<div className="text-right">
													<p className="font-semibold">
														{formatCurrency(
															item.subtotal ||
																item.unitPrice * item.quantity,
														)}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatCurrency(item.unitPrice)} ea
													</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* 2. DETAILS GRID - Wrapped in Bento */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{/* Customer */}
						<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50 flex flex-col">
							<CardHeader className="pb-3">
								<CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
									<User className="h-4 w-4" />
									Customer Details
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 space-y-4">
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner uppercase">
										{getEmployeeName().charAt(0)}
									</div>
									<div>
										<p className="font-bold text-foreground">
											{getEmployeeName()}
										</p>
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
											<Mail className="h-3 w-3" />
											{order.employee?.email || "No email"}
										</div>
									</div>
								</div>
								<Separator className="bg-border/50" />
								<div className="flex justify-between items-center text-sm">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Building className="h-3.5 w-3.5" />
										<span>Company</span>
									</div>
									<span className="font-medium">TechCorp Inc.</span>
								</div>
							</CardContent>
							<CardFooter className="pt-0 pb-4">
								<Button
									variant="secondary"
									size="sm"
									className="w-full text-xs h-8">
									View Profile
								</Button>
							</CardFooter>
						</Card>

						{/* Shipping */}
						<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50 flex flex-col">
							<CardHeader className="pb-3">
								<CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
									<MapPin className="h-4 w-4" />
									Delivery Address
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="p-3 rounded-lg bg-muted/30 border border-muted/50 space-y-1">
									<p className="font-medium text-sm text-foreground">
										{getEmployeeName()}
									</p>
									<p className="text-sm text-muted-foreground leading-relaxed">
										123 Innovation Drive,
										<br />
										Makati City, Metro Manila 1200
										<br />
										Philippines
									</p>
								</div>
							</CardContent>
							<CardFooter className="pt-0 pb-4">
								<Button
									variant="ghost"
									size="sm"
									className="w-full text-xs h-8 hover:bg-muted/50">
									Show on Map <ArrowRight className="ml-1 h-3 w-3" />
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* 3. PAYMENT (Full Width in Left Col) */}
					<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
						<div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/50">
							<div className="p-6 flex-1 flex flex-col justify-center">
								<div className="flex items-center gap-2 mb-4 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									<span className="text-sm font-medium">Payment Method</span>
								</div>
								<p className="font-semibold text-lg flex items-center gap-2">
									{order.paymentMethod?.replace("_", " ")}
									{order.paymentType === "INSTALLMENT" && (
										<Badge variant="secondary" className="text-xs font-normal">
											Monthly
										</Badge>
									)}
								</p>
								{order.paymentType === "INSTALLMENT" && (
									<p className="text-sm text-muted-foreground mt-1">
										{order.installmentMonths} months term -{" "}
										{formatCurrency(order.installmentAmount || 0)}/mo
									</p>
								)}
							</div>
							<div className="p-6 flex-1 bg-muted/10 space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Subtotal</span>
									<span>{formatCurrency(order.subtotal || order.total)}</span>
								</div>
								{order.tax > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Tax</span>
										<span>{formatCurrency(order.tax)}</span>
									</div>
								)}
								<div className="flex justify-between text-base font-bold pt-2 border-t border-dashed border-muted-foreground/30">
									<span>Total Paid</span>
									<span>{formatCurrency(order.total)}</span>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* RIGHT SIDEBAR (4 cols) */}
				<div className="md:col-span-4 flex flex-col gap-6">
					{/* STATUS & ACTIONS CARD (Sticky-ish logic could be applied here) */}
					<div className="space-y-6">
						{/* Current Status Badge */}
						<Card
							className={cn(
								"rounded-xl border-none shadow-sm overflow-hidden",
								isPending
									? "bg-yellow-50 dark:bg-yellow-950/20"
									: isApproved
										? "bg-emerald-50 dark:bg-emerald-950/20"
										: isProcessing
											? "bg-purple-50 dark:bg-purple-950/20"
											: isShipped
												? "bg-indigo-50 dark:bg-indigo-950/20"
												: isDelivered
													? "bg-green-50 dark:bg-green-950/20"
													: "bg-card",
							)}>
							<div className="p-6 text-center space-y-2">
								<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Current Status
								</p>
								<Badge
									className={cn(
										"mx-auto text-base py-1 px-4 h-auto",
										getStatusColor(order.status),
										"border-none text-white shadow-md",
									)}>
									{order.status.replace("_", " ")}
								</Badge>
								{isPending && (
									<p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
										Waiting for your approval
									</p>
								)}
							</div>
						</Card>

						{/* Actions */}
						{!isCancelled && !isDelivered && (
							<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
								<CardHeader className="pb-3">
									<CardTitle className="text-base font-semibold flex items-center gap-2">
										<Package className="h-4 w-4 text-primary" />
										Actions
									</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col gap-3">
									{isPending && (
										<>
											<Button
												onClick={() => handleStatusUpdate("APPROVED")}
												className="w-full justify-start gap-3 h-10 shadow-sm"
												variant="default">
												<CheckCircle className="h-4 w-4" />
												Approve Order
											</Button>
											<Button
												variant="outline"
												onClick={() => handleStatusUpdate("CANCELLED")}
												className="w-full justify-start gap-3 h-10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
												<XCircle className="h-4 w-4" />
												Decline Order
											</Button>
										</>
									)}
									{isApproved && (
										<Button
											onClick={() => handleStatusUpdate("PROCESSING")}
											className="w-full justify-start gap-3"
											variant="secondary">
											<Package className="h-4 w-4" />
											Start Processing
										</Button>
									)}
									{isProcessing && (
										<Button
											onClick={() => handleStatusUpdate("SHIPPED")}
											className="w-full justify-start gap-3">
											<Truck className="h-4 w-4" />
											Mark as Shipped
										</Button>
									)}
									{isShipped && (
										<Button
											onClick={() => handleStatusUpdate("DELIVERED")}
											className="w-full justify-start gap-3"
											variant="default">
											<CheckCircle className="h-4 w-4" />
											Mark as Delivered
										</Button>
									)}
								</CardContent>
							</Card>
						)}

						{/* Timeline */}
						<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50 flex-1">
							<CardHeader className="pb-4">
								<CardTitle className="text-base font-semibold flex items-center gap-2">
									<Truck className="h-4 w-4" />
									Tracking
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="pt-2">
									<TimelineItem
										title="Order Placed"
										date={order.orderDate}
										description="Customer placed the order."
										isCompleted={true}
									/>
									<TimelineItem
										title="Verified & Approved"
										description="Order approved by vendor."
										isCompleted={[
											"APPROVED",
											"PROCESSING",
											"SHIPPED",
											"DELIVERED",
										].includes(order.status)}
										isActive={order.status === "PENDING_APPROVAL"}
									/>
									<TimelineItem
										title="Processing"
										description="Items are being packed."
										isCompleted={[
											"PROCESSING",
											"SHIPPED",
											"DELIVERED",
										].includes(order.status)}
										isActive={order.status === "APPROVED"}
									/>
									<TimelineItem
										title="Shipped"
										description="Package is on its way."
										isCompleted={["SHIPPED", "DELIVERED"].includes(
											order.status,
										)}
										isActive={order.status === "PROCESSING"}
									/>
									<TimelineItem
										title="Delivered"
										description="Package received by customer."
										isCompleted={order.status === "DELIVERED"}
										isActive={order.status === "SHIPPED"}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
