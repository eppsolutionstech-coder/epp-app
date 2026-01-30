import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MOCK_LOAN_APPLICATIONS } from "~/data/mock-financer-data";
import { Search, Eye, FileText } from "lucide-react";

export default function FinancerApplications() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredApplications = MOCK_LOAN_APPLICATIONS.filter((app) => {
		const matchesSearch =
			app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.id.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || app.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return <Badge variant="secondary">Pending</Badge>;
			case "under_review":
				return (
					<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
						Under Review
					</Badge>
				);
			case "approved":
				return (
					<Badge className="bg-green-100 text-green-700 hover:bg-green-100">
						Approved
					</Badge>
				);
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getCustomerTypeBadge = (type: string) => {
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

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
				<p className="text-muted-foreground">
					Review and manage loan applications from customers.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Applications
					</CardTitle>
					<CardDescription>
						{filteredApplications.length} application(s) found
					</CardDescription>
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
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="under_review">Under Review</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Application ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Product</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead>Term</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredApplications.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="text-center py-8 text-muted-foreground">
											No applications found
										</TableCell>
									</TableRow>
								) : (
									filteredApplications.map((app) => (
										<TableRow key={app.id}>
											<TableCell className="font-medium">{app.id}</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">
														{app.customerName}
													</p>
													<p className="text-xs text-muted-foreground">
														{app.customerEmail}
													</p>
												</div>
											</TableCell>
											<TableCell>
												{getCustomerTypeBadge(app.customerType)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{app.productImage && (
														<img
															src={app.productImage}
															alt={app.productName}
															className="h-8 w-8 rounded object-cover"
														/>
													)}
													<span className="text-sm truncate max-w-[150px]">
														{app.productName}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right font-medium">
												₱{app.requestedAmount.toLocaleString()}
											</TableCell>
											<TableCell>{app.requestedTerm} mo</TableCell>
											<TableCell>{getStatusBadge(app.status)}</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{app.appliedDate}
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
