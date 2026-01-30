import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOCK_LOAN_APPLICATIONS } from "~/data/mock-financer-data";
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
} from "lucide-react";

export default function ApplicationDetail() {
	const { id } = useParams();
	const application = MOCK_LOAN_APPLICATIONS.find((app) => app.id === id);

	if (!application) {
		return (
			<div className="space-y-6">
				<Button variant="ghost" asChild>
					<Link to="/financer/applications">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applications
					</Link>
				</Button>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">Application not found</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="secondary" className="text-base px-3 py-1">
						Pending
					</Badge>
				);
			case "under_review":
				return (
					<Badge className="bg-amber-100 text-amber-700 text-base px-3 py-1">
						Under Review
					</Badge>
				);
			case "approved":
				return (
					<Badge className="bg-green-100 text-green-700 text-base px-3 py-1">
						Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge variant="destructive" className="text-base px-3 py-1">
						Rejected
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const canReview = application.status === "pending" || application.status === "under_review";

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link to="/financer/applications">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Applications
					</Link>
				</Button>
				{getStatusBadge(application.status)}
			</div>

			<div>
				<h1 className="text-3xl font-bold tracking-tight">Application {application.id}</h1>
				<p className="text-muted-foreground">Submitted on {application.appliedDate}</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Customer Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
								<User className="h-8 w-8 text-emerald-600" />
							</div>
							<div>
								<p className="text-lg font-semibold">{application.customerName}</p>
								<Badge variant="outline">
									{application.customerType.charAt(0).toUpperCase() +
										application.customerType.slice(1)}
								</Badge>
							</div>
						</div>
						<Separator />
						<div className="grid gap-3">
							<div className="flex items-center gap-2 text-sm">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span>{application.customerEmail}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<CreditCard className="h-4 w-4 text-muted-foreground" />
								<span>
									Credit Score:{" "}
									<strong>{application.creditScore || "N/A"}</strong>
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span>Applied: {application.appliedDate}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Loan Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							{application.productImage && (
								<img
									src={application.productImage}
									alt={application.productName}
									className="h-16 w-16 rounded-lg object-cover"
								/>
							)}
							<div>
								<p className="font-semibold">{application.productName}</p>
								<p className="text-sm text-muted-foreground">
									Product to be financed
								</p>
							</div>
						</div>
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Requested Amount</p>
								<p className="text-xl font-bold">
									₱{application.requestedAmount.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Interest Rate</p>
								<p className="text-xl font-bold">{application.interestRate}%</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Loan Term</p>
								<p className="text-xl font-bold">
									{application.requestedTerm} months
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Monthly Payment</p>
								<p className="text-xl font-bold">
									₱{application.monthlyPayment.toFixed(2)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{application.notes && (
				<Card>
					<CardHeader>
						<CardTitle>Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">{application.notes}</p>
					</CardContent>
				</Card>
			)}

			{canReview && (
				<Card>
					<CardHeader>
						<CardTitle>Review Actions</CardTitle>
						<CardDescription>Take action on this loan application.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-4">
							<Button className="bg-green-600 hover:bg-green-700">
								<CheckCircle className="h-4 w-4 mr-2" />
								Approve Application
							</Button>
							<Button variant="destructive">
								<XCircle className="h-4 w-4 mr-2" />
								Reject Application
							</Button>
							{application.status === "pending" && (
								<Button variant="outline">
									<Clock className="h-4 w-4 mr-2" />
									Mark Under Review
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{application.reviewedDate && (
				<Card>
					<CardHeader>
						<CardTitle>Review History</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<div
								className={`h-10 w-10 rounded-full flex items-center justify-center ${
									application.status === "approved"
										? "bg-green-100"
										: "bg-red-100"
								}`}>
								{application.status === "approved" ? (
									<CheckCircle className="h-5 w-5 text-green-600" />
								) : (
									<XCircle className="h-5 w-5 text-red-600" />
								)}
							</div>
							<div>
								<p className="font-medium">
									Application{" "}
									{application.status === "approved" ? "Approved" : "Rejected"}
								</p>
								<p className="text-sm text-muted-foreground">
									Reviewed on {application.reviewedDate}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
