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
import {
	MOCK_FINANCER_CUSTOMERS,
	MOCK_ACTIVE_LOANS,
	MOCK_PAYMENTS,
	MOCK_LOAN_APPLICATIONS,
} from "~/data/mock-financer-data";
import {
	ArrowLeft,
	User,
	Mail,
	Phone,
	Building,
	Calendar,
	CreditCard,
	TrendingUp,
	AlertTriangle,
	Wallet,
	Eye,
	Ban,
	CheckCircle,
} from "lucide-react";

export default function CustomerDetail() {
	const { id } = useParams();
	const customer = MOCK_FINANCER_CUSTOMERS.find((c) => c.id === id);

	// Get customer's loans
	const customerLoans = MOCK_ACTIVE_LOANS.filter((loan) => loan.customerId === id);

	// Get customer's payments
	const customerPayments = MOCK_PAYMENTS.filter((payment) => payment.customerId === id);

	// Get customer's applications
	const customerApplications = MOCK_LOAN_APPLICATIONS.filter((app) => app.customerId === id);

	if (!customer) {
		return (
			<div className="space-y-6">
				<Button variant="ghost" asChild>
					<Link to="/financer/customers">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Customers
					</Link>
				</Button>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-muted-foreground">Customer not found</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge className="bg-green-100 text-green-700 text-base px-3 py-1">Active</Badge>;
			case "inactive":
				return <Badge variant="secondary" className="text-base px-3 py-1">Inactive</Badge>;
			case "blacklisted":
				return <Badge variant="destructive" className="text-base px-3 py-1">Blacklisted</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getTypeBadge = (type: string) => {
		const colors: Record<string, string> = {
			employee: "bg-blue-100 text-blue-700",
			retailer: "bg-purple-100 text-purple-700",
			wholesaler: "bg-cyan-100 text-cyan-700",
			regular: "bg-gray-100 text-gray-700",
		};
		return (
			<Badge className={`${colors[type] || "bg-gray-100 text-gray-700"}`}>
				{type.charAt(0).toUpperCase() + type.slice(1)}
			</Badge>
		);
	};

	const getCreditScoreColor = (score: number) => {
		if (score >= 750) return "text-green-600";
		if (score >= 650) return "text-amber-600";
		return "text-red-600";
	};

	const getCreditScoreLabel = (score: number) => {
		if (score >= 750) return "Excellent";
		if (score >= 650) return "Good";
		if (score >= 550) return "Fair";
		return "Poor";
	};

	const getLoanStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge className="bg-blue-100 text-blue-700">Active</Badge>;
			case "completed":
				return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
			case "defaulted":
				return <Badge variant="destructive">Defaulted</Badge>;
			case "restructured":
				return <Badge className="bg-amber-100 text-amber-700">Restructured</Badge>;
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

	const totalPaidPayments = customerPayments.filter((p) => p.status === "paid").length;
	const totalOverduePayments = customerPayments.filter((p) => p.status === "overdue").length;
	const paymentRate = customerPayments.length > 0
		? ((totalPaidPayments / customerPayments.length) * 100).toFixed(0)
		: "N/A";

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link to="/financer/customers">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Customers
					</Link>
				</Button>
				{getStatusBadge(customer.status)}
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Customer Profile Card */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Customer Profile
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-start gap-6">
							{customer.avatar ? (
								<img
									src={customer.avatar}
									alt={customer.name}
									className="h-20 w-20 rounded-full"
								/>
							) : (
								<div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
									<User className="h-10 w-10 text-emerald-600" />
								</div>
							)}
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h2 className="text-2xl font-bold">{customer.name}</h2>
									{getTypeBadge(customer.type)}
								</div>
								<div className="grid gap-2 text-sm">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Mail className="h-4 w-4" />
										<span>{customer.email}</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<Phone className="h-4 w-4" />
										<span>{customer.phone}</span>
									</div>
									{customer.organization && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<Building className="h-4 w-4" />
											<span>{customer.organization}</span>
										</div>
									)}
									<div className="flex items-center gap-2 text-muted-foreground">
										<Calendar className="h-4 w-4" />
										<span>Member since {customer.joinedDate}</span>
									</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* Quick Actions */}
						<div className="flex flex-wrap gap-3">
							{customer.status !== "blacklisted" ? (
								<Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
									<Ban className="h-4 w-4 mr-2" />
									Blacklist Customer
								</Button>
							) : (
								<Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
									<CheckCircle className="h-4 w-4 mr-2" />
									Remove from Blacklist
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Credit Score Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CreditCard className="h-5 w-5" />
							Credit Score
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center">
							<p className={`text-5xl font-bold ${getCreditScoreColor(customer.creditScore)}`}>
								{customer.creditScore}
							</p>
							<p className={`text-lg font-medium ${getCreditScoreColor(customer.creditScore)}`}>
								{getCreditScoreLabel(customer.creditScore)}
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Score Range</span>
								<span>300 - 850</span>
							</div>
							<Progress
								value={((customer.creditScore - 300) / 550) * 100}
								className="h-2"
							/>
						</div>
						<Separator />
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Payment Rate</span>
								<span className="font-medium">{paymentRate}%</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Overdue Payments</span>
								<span className={`font-medium ${totalOverduePayments > 0 ? "text-red-600" : "text-green-600"}`}>
									{totalOverduePayments}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Financial Summary */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Loans</CardTitle>
						<Wallet className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{customer.activeLoans}</div>
						<p className="text-xs text-muted-foreground">Currently financed</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
						<TrendingUp className="h-4 w-4 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${customer.totalBorrowed.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">All-time total</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Paid</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							${customer.totalPaid.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">Payments received</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Outstanding</CardTitle>
						<AlertTriangle className="h-4 w-4 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-amber-600">
							${(customer.totalBorrowed - customer.totalPaid).toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">Remaining balance</p>
					</CardContent>
				</Card>
			</div>

			{/* Active Loans */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Loan History
					</CardTitle>
					<CardDescription>All loans associated with this customer</CardDescription>
				</CardHeader>
				<CardContent>
					{customerLoans.length === 0 ? (
						<p className="text-center py-8 text-muted-foreground">No loan records found</p>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Loan ID</TableHead>
										<TableHead>Product</TableHead>
										<TableHead className="text-right">Principal</TableHead>
										<TableHead>Progress</TableHead>
										<TableHead className="text-right">Remaining</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customerLoans.map((loan) => {
										const progressPercent = (loan.paidInstallments / loan.term) * 100;
										return (
											<TableRow key={loan.id}>
												<TableCell className="font-medium">{loan.id}</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														{loan.productImage && (
															<img
																src={loan.productImage}
																alt={loan.productName}
																className="h-8 w-8 rounded object-cover"
															/>
														)}
														<span className="text-sm truncate max-w-[150px]">
															{loan.productName}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													${loan.principalAmount.toLocaleString()}
												</TableCell>
												<TableCell>
													<div className="w-24">
														<Progress value={progressPercent} className="h-2" />
														<p className="text-xs text-muted-foreground mt-1">
															{loan.paidInstallments}/{loan.term} paid
														</p>
													</div>
												</TableCell>
												<TableCell className="text-right font-medium">
													${loan.remainingAmount.toLocaleString()}
												</TableCell>
												<TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
												<TableCell className="text-right">
													<Button variant="ghost" size="sm" asChild>
														<Link to={`/financer/loans/${loan.id}`}>
															<Eye className="h-4 w-4 mr-1" />
															View
														</Link>
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment History */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						Payment History
					</CardTitle>
					<CardDescription>All payment transactions for this customer</CardDescription>
				</CardHeader>
				<CardContent>
					{customerPayments.length === 0 ? (
						<p className="text-center py-8 text-muted-foreground">No payment records found</p>
					) : (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Payment ID</TableHead>
										<TableHead>Loan ID</TableHead>
										<TableHead>Due Date</TableHead>
										<TableHead>Payment Date</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead>Method</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customerPayments.map((payment) => (
										<TableRow key={payment.id}>
											<TableCell className="font-medium">{payment.id}</TableCell>
											<TableCell className="text-muted-foreground">{payment.loanId}</TableCell>
											<TableCell>{payment.dueDate}</TableCell>
											<TableCell>{payment.paymentDate || "-"}</TableCell>
											<TableCell className="text-right font-medium">
												${payment.amount.toFixed(2)}
											</TableCell>
											<TableCell className="text-sm">
												{payment.paymentMethod || "-"}
											</TableCell>
											<TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Loan Applications */}
			{customerApplications.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Loan Applications</CardTitle>
						<CardDescription>Application history for this customer</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Application ID</TableHead>
										<TableHead>Product</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead>Term</TableHead>
										<TableHead>Applied Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customerApplications.map((app) => (
										<TableRow key={app.id}>
											<TableCell className="font-medium">{app.id}</TableCell>
											<TableCell>{app.productName}</TableCell>
											<TableCell className="text-right">
												${app.requestedAmount.toLocaleString()}
											</TableCell>
											<TableCell>{app.requestedTerm} mo</TableCell>
											<TableCell>{app.appliedDate}</TableCell>
											<TableCell>
												<Badge
													variant={
														app.status === "approved"
															? "default"
															: app.status === "rejected"
															? "destructive"
															: "secondary"
													}
													className={
														app.status === "approved"
															? "bg-green-100 text-green-700"
															: app.status === "under_review"
															? "bg-amber-100 text-amber-700"
															: ""
													}>
													{app.status === "under_review"
														? "Under Review"
														: app.status.charAt(0).toUpperCase() + app.status.slice(1)}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link to={`/financer/applications/${app.id}`}>
														<Eye className="h-4 w-4 mr-1" />
														View
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}