import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MOCK_FINANCER_CUSTOMERS } from "~/data/mock-financer-data";
import { Search, Users, Eye, TrendingUp, AlertTriangle } from "lucide-react";

export default function FinancerCustomers() {
	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredCustomers = MOCK_FINANCER_CUSTOMERS.filter((customer) => {
		const matchesSearch =
			customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			customer.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesType = typeFilter === "all" || customer.type === typeFilter;
		const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
		return matchesSearch && matchesType && matchesStatus;
	});

	const activeCustomers = MOCK_FINANCER_CUSTOMERS.filter((c) => c.status === "active").length;
	const totalBorrowed = MOCK_FINANCER_CUSTOMERS.reduce((sum, c) => sum + c.totalBorrowed, 0);
	const totalPaid = MOCK_FINANCER_CUSTOMERS.reduce((sum, c) => sum + c.totalPaid, 0);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
				);
			case "inactive":
				return <Badge variant="secondary">Inactive</Badge>;
			case "blacklisted":
				return <Badge variant="destructive">Blacklisted</Badge>;
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
			<Badge className={`${colors[type] || "bg-gray-100 text-gray-700"} hover:opacity-80`}>
				{type.charAt(0).toUpperCase() + type.slice(1)}
			</Badge>
		);
	};

	const getCreditScoreColor = (score: number) => {
		if (score >= 750) return "text-green-600";
		if (score >= 650) return "text-amber-600";
		return "text-red-600";
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Customers</h1>
				<p className="text-muted-foreground">
					Manage your financing customers and their profiles.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Customers</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{MOCK_FINANCER_CUSTOMERS.length}</div>
						<p className="text-xs text-muted-foreground">{activeCustomers} active</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Financed</CardTitle>
						<TrendingUp className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">₱{totalBorrowed.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Across all customers</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Collected</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							₱{totalPaid.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">Payments received</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Blacklisted</CardTitle>
						<AlertTriangle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{
								MOCK_FINANCER_CUSTOMERS.filter((c) => c.status === "blacklisted")
									.length
							}
						</div>
						<p className="text-xs text-muted-foreground">Restricted customers</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Customer List
					</CardTitle>
					<CardDescription>{filteredCustomers.length} customer(s) found</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by name, email, or ID..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={typeFilter} onValueChange={setTypeFilter}>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue placeholder="Customer type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="employee">Employee</SelectItem>
								<SelectItem value="retailer">Retailer</SelectItem>
								<SelectItem value="wholesaler">Wholesaler</SelectItem>
								<SelectItem value="regular">Regular</SelectItem>
							</SelectContent>
						</Select>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="blacklisted">Blacklisted</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Organization</TableHead>
									<TableHead className="text-center">Active Loans</TableHead>
									<TableHead className="text-right">Total Borrowed</TableHead>
									<TableHead className="text-right">Total Paid</TableHead>
									<TableHead className="text-center">Credit Score</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCustomers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="text-center py-8 text-muted-foreground">
											No customers found
										</TableCell>
									</TableRow>
								) : (
									filteredCustomers.map((customer) => (
										<TableRow key={customer.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													{customer.avatar && (
														<img
															src={customer.avatar}
															alt={customer.name}
															className="h-8 w-8 rounded-full"
														/>
													)}
													<div>
														<p className="font-medium">
															{customer.name}
														</p>
														<p className="text-xs text-muted-foreground">
															{customer.email}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>{getTypeBadge(customer.type)}</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{customer.organization || "-"}
											</TableCell>
											<TableCell className="text-center">
												<Badge variant="outline">
													{customer.activeLoans}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												₱{customer.totalBorrowed.toLocaleString()}
											</TableCell>
											<TableCell className="text-right text-green-600">
												₱{customer.totalPaid.toLocaleString()}
											</TableCell>
											<TableCell className="text-center">
												<span
													className={`font-bold ${getCreditScoreColor(customer.creditScore)}`}>
													{customer.creditScore}
												</span>
											</TableCell>
											<TableCell>{getStatusBadge(customer.status)}</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link to={`/financer/customers/${customer.id}`}>
														<Eye className="h-4 w-4 mr-1" />
														View
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
