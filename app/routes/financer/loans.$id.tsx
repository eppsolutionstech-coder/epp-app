import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MOCK_ACTIVE_LOANS, MOCK_PAYMENTS } from "~/data/mock-financer-data";
import { ArrowLeft, User, Mail, Calendar, Wallet, TrendingUp, AlertTriangle } from "lucide-react";

export default function LoanDetail() {
	const { id } = useParams();
	const loan = MOCK_ACTIVE_LOANS.find((l) => l.id === id);
	const loanPayments = MOCK_PAYMENTS.filter((p) => p.loanId === id);

	if (!loan) {
		return (
			<div className="space-y-6">
				<Button variant="ghost" asChild>
					<Link to="/financer/loans">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Loans
					</Link>
				</Button>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">Loan not found</p>
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

	const getPaymentStatusBadge = (status: string) => {
		switch (status) {
			case "paid":
				return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
			case "pending":
				return <Badge variant="secondary">Pending</Badge>;
			case "overdue":
				return <Badge variant="destructive">Overdue</Badge>;
			case "partial":
				return <Badge className="bg-amber-100 text-amber-700">Partial</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const progressPercent = (loan.paidInstallments / loan.term) * 100;
	const amountProgressPercent = (loan.paidAmount / loan.totalAmount) * 100;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link to="/financer/loans">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Loans
					</Link>
				</Button>
				{getStatusBadge(loan.status)}
			</div>

			<div>
				<h1 className="text-3xl font-bold tracking-tight">Loan {loan.id}</h1>
				<p className="text-muted-foreground">Started on {loan.startDate}</p>
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
								<p className="text-lg font-semibold">{loan.customerName}</p>
								<Badge variant="outline">
									{loan.customerType.charAt(0).toUpperCase() +
										loan.customerType.slice(1)}
								</Badge>
							</div>
						</div>
						<Separator />
						<div className="grid gap-3">
							<div className="flex items-center gap-2 text-sm">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span>{loan.customerEmail}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span>Loan Start: {loan.startDate}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Wallet className="h-5 w-5" />
							Loan Summary
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							{loan.productImage && (
								<img
									src={loan.productImage}
									alt={loan.productName}
									className="h-16 w-16 rounded-lg object-cover"
								/>
							)}
							<div>
								<p className="font-semibold">{loan.productName}</p>
								<p className="text-sm text-muted-foreground">Financed Product</p>
							</div>
						</div>
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Principal</p>
								<p className="text-xl font-bold">
									₱{loan.principalAmount.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Interest Rate</p>
								<p className="text-xl font-bold">{loan.interestRate}%</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Amount</p>
								<p className="text-xl font-bold">
									₱{loan.totalAmount.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Monthly Payment</p>
								<p className="text-xl font-bold">
									₱{loan.monthlyPayment.toFixed(2)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Repayment Progress
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium">Installments</span>
								<span className="text-sm text-muted-foreground">
									{loan.paidInstallments} of {loan.term}
								</span>
							</div>
							<Progress value={progressPercent} className="h-3" />
						</div>
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium">Amount Paid</span>
								<span className="text-sm text-muted-foreground">
									₱{loan.paidAmount.toLocaleString()} of ₱
									{loan.totalAmount.toLocaleString()}
								</span>
							</div>
							<Progress value={amountProgressPercent} className="h-3" />
						</div>
					</div>

					<Separator />

					<div className="grid gap-4 md:grid-cols-4">
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<p className="text-2xl font-bold text-green-600">
								₱{loan.paidAmount.toLocaleString()}
							</p>
							<p className="text-sm text-muted-foreground">Total Paid</p>
						</div>
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<p className="text-2xl font-bold text-amber-600">
								₱{loan.remainingAmount.toLocaleString()}
							</p>
							<p className="text-sm text-muted-foreground">Remaining</p>
						</div>
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<p className="text-2xl font-bold">{loan.paidInstallments}</p>
							<p className="text-sm text-muted-foreground">Paid Installments</p>
						</div>
						<div className="text-center p-4 bg-muted/50 rounded-lg">
							<p className="text-2xl font-bold">{loan.remainingInstallments}</p>
							<p className="text-sm text-muted-foreground">Remaining</p>
						</div>
					</div>

					{loan.nextPaymentDate && loan.status === "active" && (
						<div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
							<Calendar className="h-6 w-6 text-blue-600" />
							<div>
								<p className="font-medium">Next Payment Due</p>
								<p className="text-sm text-muted-foreground">
									{loan.nextPaymentDate} - ₱{loan.monthlyPayment.toFixed(2)}
								</p>
							</div>
						</div>
					)}

					{loan.status === "defaulted" && (
						<div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
							<AlertTriangle className="h-6 w-6 text-red-600" />
							<div>
								<p className="font-medium text-red-700">Loan in Default</p>
								<p className="text-sm text-red-600">
									This loan has missed multiple payments and requires attention.
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Payment History</CardTitle>
					<CardDescription>All payments for this loan</CardDescription>
				</CardHeader>
				<CardContent>
					{loanPayments.length === 0 ? (
						<p className="text-center py-8 text-muted-foreground">
							No payment records found
						</p>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Payment ID</TableHead>
										<TableHead>Due Date</TableHead>
										<TableHead>Payment Date</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead className="text-right">Principal</TableHead>
										<TableHead className="text-right">Interest</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{loanPayments.map((payment) => (
										<TableRow key={payment.id}>
											<TableCell className="font-medium">
												{payment.id}
											</TableCell>
											<TableCell>{payment.dueDate}</TableCell>
											<TableCell>{payment.paymentDate || "-"}</TableCell>
											<TableCell className="text-right">
												₱{payment.amount.toFixed(2)}
											</TableCell>
											<TableCell className="text-right">
												₱{payment.principalPortion.toFixed(2)}
											</TableCell>
											<TableCell className="text-right">
												₱{payment.interestPortion.toFixed(2)}
											</TableCell>
											<TableCell>
												{getPaymentStatusBadge(payment.status)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
