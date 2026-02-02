import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MOCK_ACTIVE_LOANS } from "~/data/mock-financer-data";
import {
	ArrowLeft,
	User,
	Mail,
	CreditCard,
	Calendar,
	FileText,
	Wallet,
	TrendingUp,
	AlertCircle,
	CheckCircle,
	Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoanDetail() {
	const { id } = useParams();
	const loan = MOCK_ACTIVE_LOANS.find((l) => l.id === id);

	if (!loan) {
		return (
			<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				<Button variant="ghost" asChild>
					<Link to="/financer/loans" className="hover:text-primary transition-colors">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Loans
					</Link>
				</Button>
				<Card className="shadow-md border-border/50">
					<CardContent className="py-12 text-center">
						<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
						<p className="text-muted-foreground text-lg">Loan not found</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-blue-100 text-blue-700 text-base px-3 py-1">Active</Badge>
				);
			case "completed":
				return (
					<Badge className="bg-green-100 text-green-700 text-base px-3 py-1">
						Completed
					</Badge>
				);
			case "defaulted":
				return (
					<Badge variant="destructive" className="text-base px-3 py-1">
						Defaulted
					</Badge>
				);
			case "restructured":
				return (
					<Badge className="bg-amber-100 text-amber-700 text-base px-3 py-1">
						Restructured
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const progressPercent = (loan.paidInstallments / loan.term) * 100;

	// Mock payment history
	const paymentHistory = [
		{ date: "2024-05-15", amount: loan.monthlyPayment, status: "paid" },
		{ date: "2024-04-15", amount: loan.monthlyPayment, status: "paid" },
		{ date: "2024-03-15", amount: loan.monthlyPayment, status: "paid" },
	];

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild className="hover:text-primary transition-colors">
					<Link to="/financer/loans">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Loans
					</Link>
				</Button>
				<div className="flex items-center gap-3">
					<span className="text-sm text-muted-foreground">Loan Status:</span>
					{getStatusBadge(loan.status)}
				</div>
			</div>

			<div>
				<h1 className="text-4xl font-bold tracking-tight mb-1">Loan {loan.id}</h1>
				<p className="text-muted-foreground">Managed by Financer Team</p>
			</div>

			{/* Top Summary Cards */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
					<CardContent className="p-6">
						<div className="flex items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium text-muted-foreground">Principal</p>
							<Wallet className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="text-2xl font-bold">
							₱{loan.principalAmount.toLocaleString()}
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
					<CardContent className="p-6">
						<div className="flex items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium text-muted-foreground">Remaining</p>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="text-2xl font-bold text-primary">
							₱{loan.remainingAmount.toLocaleString()}
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
					<CardContent className="p-6">
						<div className="flex items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium text-muted-foreground">
								Monthly Payment
							</p>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="text-2xl font-bold">
							₱{loan.monthlyPayment.toLocaleString()}
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
					<CardContent className="p-6">
						<div className="flex items-center justify-between space-y-0 pb-2">
							<p className="text-sm font-medium text-muted-foreground">
								Next Payment
							</p>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="text-2xl font-bold">{loan.nextPaymentDate || "N/A"}</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Product & Loan Progress */}
				<Card className="shadow-md border-border/50 h-full">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl font-semibold">
							<div className="p-2 rounded-full bg-purple-100 text-purple-600">
								<FileText className="h-5 w-5" />
							</div>
							Loan Progress
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center gap-4">
							{loan.productImage ? (
								<img
									src={loan.productImage}
									alt={loan.productName}
									className="h-20 w-20 rounded-xl object-cover shadow-sm border"
								/>
							) : (
								<div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center">
									<FileText className="h-8 w-8 text-muted-foreground" />
								</div>
							)}
							<div>
								<p className="font-bold text-lg">{loan.productName}</p>
								<p className="text-sm text-muted-foreground">Financed Item</p>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="flex justify-between text-sm">
								<span className="font-medium">Repayment Progress</span>
								<span className="text-muted-foreground">
									{progressPercent.toFixed(0)}%
								</span>
							</div>
							<Progress value={progressPercent} className="h-3" />
							<div className="flex justify-between text-sm text-muted-foreground">
								<span>{loan.paidInstallments} months paid</span>
								<span>{loan.term} months total</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
							<div>
								<p className="text-xs text-muted-foreground uppercase">
									Interest Rate
								</p>
								<p className="font-semibold">{loan.interestRate}%</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground uppercase">
									Term Length
								</p>
								<p className="font-semibold">{loan.term} months</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Customer Info */}
				<Card className="shadow-md border-border/50 h-full">
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
									{loan.customerName}
								</p>
								<Badge variant="outline" className="mt-1">
									{loan.customerType.charAt(0).toUpperCase() +
										loan.customerType.slice(1)}
								</Badge>
							</div>
						</div>
						<Separator />
						<div className="grid gap-4">
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span className="font-medium">customer@example.com</span>
							</div>
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span>ID: {loan.customerId || "CUST-001"}</span>
							</div>
							<div className="flex items-center gap-3 text-sm group">
								<div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
									<Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
								<span>Start Date: 2024-01-15</span>
							</div>
						</div>
						<div className="pt-4">
							<Button variant="outline" className="w-full">
								View Full Customer Profile
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Payment History */}
			<Card className="shadow-md border-border/50">
				<CardHeader>
					<CardTitle className="text-lg font-semibold">Recent Payment History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<div className="grid grid-cols-3 p-4 bg-muted/50 font-medium text-sm">
							<div>Date</div>
							<div>Amount</div>
							<div className="text-right">Status</div>
						</div>
						{paymentHistory.map((payment, i) => (
							<div
								key={i}
								className="grid grid-cols-3 p-4 border-t text-sm items-center hover:bg-muted/20 transition-colors">
								<div className="font-medium">{payment.date}</div>
								<div>₱{payment.amount.toLocaleString()}</div>
								<div className="text-right">
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-700 hover:bg-green-100">
										<CheckCircle className="h-3 w-3 mr-1" /> Paid
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
