import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { MOCK_ACTIVE_LOANS } from "~/data/mock-financer-data";
import { Search, Eye, Wallet } from "lucide-react";

export default function FinancerLoans() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredLoans = MOCK_ACTIVE_LOANS.filter((loan) => {
		const matchesSearch =
			loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			loan.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			loan.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>
				);
			case "completed":
				return (
					<Badge className="bg-green-100 text-green-700 hover:bg-green-100">
						Completed
					</Badge>
				);
			case "defaulted":
				return <Badge variant="destructive">Defaulted</Badge>;
			case "restructured":
				return (
					<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
						Restructured
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const totalPortfolio = filteredLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
	const activeCount = filteredLoans.filter((l) => l.status === "active").length;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Active Loans</h1>
				<p className="text-muted-foreground">Manage and track all financed loans.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">₱{totalPortfolio.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							Across {activeCount} active loans
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Active Loans</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeCount}</div>
						<p className="text-xs text-muted-foreground">Currently being serviced</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Completed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filteredLoans.filter((l) => l.status === "completed").length}
						</div>
						<p className="text-xs text-muted-foreground">Fully paid off</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Loans
					</CardTitle>
					<CardDescription>{filteredLoans.length} loan(s) found</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by name, product, or ID..."
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
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="defaulted">Defaulted</SelectItem>
								<SelectItem value="restructured">Restructured</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Loan ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Product</TableHead>
									<TableHead className="text-right">Principal</TableHead>
									<TableHead>Progress</TableHead>
									<TableHead className="text-right">Remaining</TableHead>
									<TableHead>Next Payment</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredLoans.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="text-center py-8 text-muted-foreground">
											No loans found
										</TableCell>
									</TableRow>
								) : (
									filteredLoans.map((loan) => {
										const progressPercent =
											(loan.paidInstallments / loan.term) * 100;
										return (
											<TableRow key={loan.id}>
												<TableCell className="font-medium">
													{loan.id}
												</TableCell>
												<TableCell>
													<div>
														<p className="font-medium">
															{loan.customerName}
														</p>
														<p className="text-xs text-muted-foreground">
															{loan.customerType}
														</p>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														{loan.productImage && (
															<img
																src={loan.productImage}
																alt={loan.productName}
																className="h-8 w-8 rounded object-cover"
															/>
														)}
														<span className="text-sm truncate max-w-[120px]">
															{loan.productName}
														</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													₱{loan.principalAmount.toLocaleString()}
												</TableCell>
												<TableCell>
													<div className="w-24">
														<Progress
															value={progressPercent}
															className="h-2"
														/>
														<p className="text-xs text-muted-foreground mt-1">
															{loan.paidInstallments}/{loan.term} paid
														</p>
													</div>
												</TableCell>
												<TableCell className="text-right font-medium">
													₱{loan.remainingAmount.toLocaleString()}
												</TableCell>
												<TableCell className="text-sm">
													{loan.nextPaymentDate || "-"}
												</TableCell>
												<TableCell>{getStatusBadge(loan.status)}</TableCell>
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
									})
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
