import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PAYMENTS } from "~/data/mock-financer-data";
import { Search, CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function FinancerPayments() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredPayments = MOCK_PAYMENTS.filter((payment) => {
		const matchesSearch =
			payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			payment.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			payment.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const paidPayments = MOCK_PAYMENTS.filter((p) => p.status === "paid");
	const pendingPayments = MOCK_PAYMENTS.filter((p) => p.status === "pending");
	const overduePayments = MOCK_PAYMENTS.filter((p) => p.status === "overdue");

	const totalCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0);
	const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
	const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "paid":
				return (
					<Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
				);
			case "pending":
				return <Badge variant="secondary">Pending</Badge>;
			case "overdue":
				return <Badge variant="destructive">Overdue</Badge>;
			case "partial":
				return (
					<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
						Partial
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const PaymentsTable = ({ payments }: { payments: typeof MOCK_PAYMENTS }) => (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Payment ID</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Loan ID</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead>Payment Date</TableHead>
						<TableHead className="text-right">Amount</TableHead>
						<TableHead>Method</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{payments.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={8}
								className="text-center py-8 text-muted-foreground">
								No payments found
							</TableCell>
						</TableRow>
					) : (
						payments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell className="font-medium">{payment.id}</TableCell>
								<TableCell>{payment.customerName}</TableCell>
								<TableCell className="text-muted-foreground">
									{payment.loanId}
								</TableCell>
								<TableCell>{payment.dueDate}</TableCell>
								<TableCell>{payment.paymentDate || "-"}</TableCell>
								<TableCell className="text-right font-medium">
									₱{payment.amount.toFixed(2)}
								</TableCell>
								<TableCell className="text-sm">
									{payment.paymentMethod || "-"}
								</TableCell>
								<TableCell>{getStatusBadge(payment.status)}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Payments</h1>
				<p className="text-muted-foreground">Track and manage all loan payments.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Collected (This Month)
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							₱{totalCollected.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							{paidPayments.length} payments received
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-amber-600">
							₱{totalPending.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							{pendingPayments.length} payments due
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Overdue</CardTitle>
						<AlertTriangle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							₱{totalOverdue.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							{overduePayments.length} payments overdue
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Payments</TabsTrigger>
					<TabsTrigger value="overdue" className="text-red-600">
						Overdue ({overduePayments.length})
					</TabsTrigger>
					<TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
					<TabsTrigger value="paid">Paid ({paidPayments.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								All Payments
							</CardTitle>
							<CardDescription>
								{filteredPayments.length} payment(s) found
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row gap-4 mb-6">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by name, payment ID, or loan ID..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full sm:w-[180px]">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="paid">Paid</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="overdue">Overdue</SelectItem>
										<SelectItem value="partial">Partial</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<PaymentsTable payments={filteredPayments} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="overdue">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-red-600">
								<AlertTriangle className="h-5 w-5" />
								Overdue Payments
							</CardTitle>
							<CardDescription>
								Payments that have passed their due date
							</CardDescription>
						</CardHeader>
						<CardContent>
							<PaymentsTable payments={overduePayments} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pending">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-amber-600" />
								Pending Payments
							</CardTitle>
							<CardDescription>Upcoming payments due</CardDescription>
						</CardHeader>
						<CardContent>
							<PaymentsTable payments={pendingPayments} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="paid">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle className="h-5 w-5 text-green-600" />
								Paid Payments
							</CardTitle>
							<CardDescription>Successfully received payments</CardDescription>
						</CardHeader>
						<CardContent>
							<PaymentsTable payments={paidPayments} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
