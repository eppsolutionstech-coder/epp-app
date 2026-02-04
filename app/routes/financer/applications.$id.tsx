import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	User,
	Mail,
	CreditCard,
	Calendar,
	FileText,
	CheckCircle,
	XCircle,
	Clock,
	AlertCircle,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetOrderById } from "~/hooks/use-order";

export default function ApplicationDetail() {
	const { id } = useParams();

	const { data: orderResponse, isLoading } = useGetOrderById(id!, {
		fields: "id, orderNumber, userId, status, orderDate, updatedAt, paymentType, paymentMethod, installmentMonths, installmentCount, installmentAmount, subtotal, tax, total, orderItems.id, orderItems.quantity, orderItems.unitPrice, orderItems.subtotal, orderItems.item.name, orderItems.item.sku, orderItems.item.images, approvals",
	});

	const application = orderResponse as any;

	// Local state to simulate status changes - initialized when data loads
	const [status, setStatus] = useState<string>("PENDING_APPROVAL");
	const [reviewDate, setReviewDate] = useState<string | null>(null);

	// Sync status when data loads
	useEffect(() => {
		if (application?.status) {
			setStatus(application.status);
		}
	}, [application?.status]);

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!application) {
		return (
			<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<Button variant="ghost" asChild>
					<Link
						to="/financer/applications"
						className="hover:text-primary transition-colors">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applications
					</Link>
				</Button>
				<Card className="shadow-md border-border/50">
					<CardContent className="py-12 text-center">
						<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
						<p className="text-muted-foreground text-lg">Application not found</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusBadge = (currentStatus: string) => {
		switch (currentStatus) {
			case "PENDING_APPROVAL":
			case "PENDING":
				return (
					<Badge variant="secondary" className="text-base px-3 py-1">
						Pending
					</Badge>
				);
			case "UNDER_REVIEW":
				return (
					<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-base px-3 py-1">
						Under Review
					</Badge>
				);
			case "APPROVED":
				return (
					<Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-base px-3 py-1">
						Approved
					</Badge>
				);
			case "REJECTED":
				return (
					<Badge variant="destructive" className="text-base px-3 py-1">
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="outline">{currentStatus}</Badge>;
		}
	};

	const handleAction = (newStatus: "APPROVED" | "REJECTED" | "UNDER_REVIEW") => {
		setStatus(newStatus);
		if (newStatus === "APPROVED" || newStatus === "REJECTED") {
			setReviewDate(
				new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
			);
		}
	};

	const canReview =
		status === "PENDING_APPROVAL" || status === "PENDING" || status === "UNDER_REVIEW";

	// Helper to get customer name
	const getCustomerName = () => {
		if (application.user?.firstName && application.user?.lastName) {
			return `${application.user.firstName} ${application.user.lastName}`;
		}
		return application.user?.username || application.userId || "Unknown Customer";
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild className="hover:text-primary transition-colors">
					<Link to="/financer/applications">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applications
					</Link>
				</Button>
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">Current Status:</span>
					{getStatusBadge(status)}
				</div>
			</div>

			<div>
				<h1 className="text-4xl font-bold tracking-tight mb-1">
					Application {application.orderNumber || application.id}
				</h1>
				<p className="text-muted-foreground">
					Submitted on {new Date(application.orderDate).toLocaleDateString()}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="shadow-md border-border/50 transition-all duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl font-semibold">
							<div className="p-2 rounded-full bg-blue-100 text-blue-600">
								<User className="h-5 w-5" />
							</div>
							Customer Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-4">
							<div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center ring-4 ring-background shadow-sm">
								<User className="h-8 w-8 text-emerald-600" />
							</div>
							<div>
								<p className="text-lg font-bold text-foreground">
									{getCustomerName()}
								</p>
								<Badge variant="outline" className="mt-1">
									Regular Customer
								</Badge>
							</div>
						</div>
						<Separator />
						<div className="grid gap-4">
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span className="font-medium">
									{application.user?.email || "No email"}
								</span>
							</div>
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span>
									Credit Score:{" "}
									<span className="font-bold text-amber-600">N/A</span>
								</span>
							</div>
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span>
									Applied: {new Date(application.orderDate).toLocaleDateString()}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-md border-border/50 transition-all duration-300 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl font-semibold">
							<div className="p-2 rounded-full bg-purple-100 text-purple-600">
								<FileText className="h-5 w-5" />
							</div>
							Loan Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							{application.orderItems?.map((orderItem: any) => {
								const item = orderItem.item;
								const imageUrl = item?.images?.[0]?.url;

								return (
									<div key={orderItem.id} className="flex items-center gap-4">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={item?.name || "Product"}
												className="h-20 w-20 min-w-20 rounded-xl object-cover shadow-sm border"
											/>
										) : (
											<div className="h-20 w-20 min-w-20 rounded-xl bg-muted flex items-center justify-center">
												<FileText className="h-8 w-8 text-muted-foreground" />
											</div>
										)}
										<div>
											<p className="font-bold text-lg leading-tight mb-1">
												{item?.name || "Unknown Product"}
											</p>
											<div className="text-sm text-muted-foreground flex flex-wrap gap-x-2">
												<span>Qty: {orderItem.quantity}</span>
												<span>•</span>
												<span>
													Price: ₱
													{(orderItem.unitPrice || 0).toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<Separator />
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Requested Amount
								</p>
								<p className="text-2xl font-bold tracking-tight text-primary">
									₱{(application.subtotal || 0).toLocaleString()}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Monthly Payment
								</p>
								<p className="text-2xl font-bold tracking-tight">
									₱
									{(application.installmentAmount || 0).toLocaleString(
										undefined,
										{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
									)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Interest Rate
								</p>
								<p className="text-lg font-semibold">
									0% {/* Hardcoded for now as it's not in schema */}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Loan Term
								</p>
								<p className="text-lg font-semibold">
									{application.installmentMonths || 0} months
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{application.notes && (
				<Card className="shadow-md border-border/50">
					<CardHeader>
						<CardTitle className="text-lg font-semibold">Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg italic">
							"{application.notes}"
						</p>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-6 md:grid-cols-3">
				{canReview && (
					<Card className="md:col-span-3 shadow-md border-border/50 border-t-4 border-t-primary">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle className="h-5 w-5 text-primary" />
								Review Actions
							</CardTitle>
							<CardDescription>
								Please review the application details carefully before taking
								action.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-4">
								<Button
									onClick={() => handleAction("APPROVED")}
									className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
									<CheckCircle className="h-4 w-4 mr-2" />
									Approve Application
								</Button>
								<Button
									onClick={() => handleAction("REJECTED")}
									variant="destructive"
									className="shadow-sm hover:shadow-md transition-all duration-200">
									<XCircle className="h-4 w-4 mr-2" />
									Reject Application
								</Button>
								{(status === "PENDING_APPROVAL" || status === "PENDING") && (
									<Button
										onClick={() => handleAction("UNDER_REVIEW")}
										variant="outline"
										className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all duration-200">
										<Clock className="h-4 w-4 mr-2" />
										Mark Under Review
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{(reviewDate || status === "APPROVED" || status === "REJECTED") && (
					<Card
						className={cn(
							"md:col-span-3 shadow-md border-border/50 border-t-4",
							status === "APPROVED" ? "border-t-green-500" : "border-t-red-500",
						)}>
						<CardHeader>
							<CardTitle>Review History</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 animate-in zoom-in-95 duration-300">
								<div
									className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm ${
										status === "APPROVED" ? "bg-green-100" : "bg-red-100"
									}`}>
									{status === "APPROVED" ? (
										<CheckCircle className="h-6 w-6 text-green-600" />
									) : (
										<XCircle className="h-6 w-6 text-red-600" />
									)}
								</div>
								<div>
									<p className="font-bold text-lg">
										Application{" "}
										{status === "APPROVED" ? "Approved" : "Rejected"}
									</p>
									<p className="text-sm text-muted-foreground">
										Action taken on{" "}
										{reviewDate ||
											new Date(application.updatedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
