import { useState } from "react";
import { Link, useParams } from "react-router";
import {
	Building2,
	ChevronRight,
	Loader2,
	Pencil,
	Trash2,
	MoreVertical,
	CreditCard,
	Percent,
	Calendar,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useGetFinancierConfigById,
	useUpdateFinancierConfig,
	useDeleteFinancierConfig,
} from "~/hooks/use-financier-config";
import type {
	FinancierConfigWithRelation,
	UpdateFinancierConfig,
} from "~/zod/financier-config.zod";
import { OrganizationUpsertModal } from "~/components/financer/profile/organization-upsert-modal";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

const getUtilizationPercentage = (used: number, max: number) => {
	if (max === 0) return 0;
	return Math.round((used / max) * 100);
};

const getUserTypeBadgeStyle = (userType: string) => {
	switch (userType) {
		case "EMPLOYEE":
			return "bg-blue-100 text-blue-700";
		case "WHOLESALER":
			return "bg-cyan-100 text-cyan-700";
		case "INDIVIDUAL":
			return "bg-purple-100 text-purple-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
};

export default function FinancierConfigDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch data
	const { data, isLoading, isError } = useGetFinancierConfigById(id!);
	const config = data as FinancierConfigWithRelation;

	// Mutations
	const updateMutation = useUpdateFinancierConfig();
	const deleteMutation = useDeleteFinancierConfig();

	const handleEdit = () => {
		setIsModalOpen(true);
	};

	const handleDelete = async () => {
		if (confirm(`Are you sure you want to delete "${config?.name}"?`)) {
			try {
				await deleteMutation.mutateAsync(id!);
				toast.success("Organization deleted successfully");
				// Navigate back
				window.location.href = "/financer/profile?tab=organizations";
			} catch (error: any) {
				toast.error(error.message || "Failed to delete organization");
			}
		}
	};

	const handleSubmit = async (data: UpdateFinancierConfig) => {
		try {
			await updateMutation.mutateAsync({
				financierConfigId: id!,
				data,
			});
			toast.success("Organization updated successfully");
			setIsModalOpen(false);
		} catch (error: any) {
			toast.error(error.message || "Failed to update organization");
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 bg-muted animate-pulse rounded" />
				<div className="h-64 w-full bg-muted animate-pulse rounded" />
			</div>
		);
	}

	// Error or not found state
	if (isError || !config) {
		return (
			<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
				<Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
				<h1 className="text-2xl font-bold">Organization not found</h1>
				<Button asChild variant="outline">
					<Link to="/financer/profile?tab=organizations">Back to Organizations</Link>
				</Button>
			</div>
		);
	}

	const utilization = getUtilizationPercentage(
		config.usedCredits || 0,
		config.maxCreditLimit || 0,
	);

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<div className="flex items-center text-sm text-muted-foreground">
				<Link
					to="/financer/profile/organizations"
					className="hover:text-foreground transition-colors">
					Organization Configurations
				</Link>
				<ChevronRight className="h-4 w-4 mx-2" />
				<span className="font-medium text-foreground">{config.name}</span>
			</div>

			{/* Header Section */}
			<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
				<div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
					{config.name.charAt(0)}
				</div>
				<div className="flex-1 space-y-2">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
							<div className="flex items-center gap-3 text-muted-foreground mt-1">
								{config.code && (
									<>
										<span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
											{config.code}
										</span>
										<span>•</span>
									</>
								)}
								<div className="flex items-center gap-1 text-sm">
									<Calendar className="h-3.5 w-3.5" />
									<span>
										Created {new Date(config.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" onClick={handleEdit}>
								<Pencil className="h-4 w-4 mr-2" />
								Edit
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										className="text-destructive"
										onClick={handleDelete}>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge className={getUserTypeBadgeStyle(config.userType)}>
							{config.userType}
						</Badge>
						<Badge
							variant={config.isActive ? "default" : "secondary"}
							className={config.isActive ? "bg-green-100 text-green-700" : ""}>
							{config.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>
				</div>
			</div>

			<Separator />

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<CreditCard className="h-4 w-4" />
							Credit Limit
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(config.maxCreditLimit || 0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Maximum available credit
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-emerald-600" />
							Available Credits
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-emerald-600">
							{formatCurrency(config.availableCredits || 0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{formatCurrency(config.usedCredits || 0)} used
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-blue-600" />
							Auto-Approve Limit
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(config.autoApproveLimit || 0)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Auto-approved below this amount
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Credit Utilization */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Credit Utilization</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								{formatCurrency(config.usedCredits || 0)} of{" "}
								{formatCurrency(config.maxCreditLimit || 0)} used
							</span>
							<span className="font-medium">{utilization}%</span>
						</div>
						<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full transition-all ${
									utilization >= 90
										? "bg-red-500"
										: utilization >= 70
											? "bg-amber-500"
											: "bg-emerald-500"
								}`}
								style={{ width: `${utilization}%` }}
							/>
						</div>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>0%</span>
							<span>50%</span>
							<span>100%</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Installment Rates */}
			{config.installmentRateConfig && config.installmentRateConfig.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base flex items-center gap-2">
							<Percent className="h-4 w-4" />
							Installment Rate Configuration
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 md:grid-cols-5">
							{config.installmentRateConfig.map((tier) => (
								<div
									key={tier.installmentCount}
									className="p-4 border rounded-lg bg-emerald-50 border-emerald-200 text-center">
									<div className="text-2xl font-bold text-emerald-600">
										{tier.rate}%
									</div>
									<div className="text-sm text-muted-foreground mt-1">
										{tier.installmentCount} months
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Notes */}
			{config.notes && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Notes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">{config.notes}</p>
					</CardContent>
				</Card>
			)}

			{/* Additional Info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Additional Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Organization ID</p>
							<p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
								{config.organizationId || "N/A"}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">User ID</p>
							<p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">
								{config.userId}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Created At</p>
							<p className="text-sm">{new Date(config.createdAt).toLocaleString()}</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-muted-foreground">Last Updated</p>
							<p className="text-sm">{new Date(config.updatedAt).toLocaleString()}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Edit Modal */}
			<OrganizationUpsertModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				organization={config}
				onSubmit={handleSubmit}
				isLoading={updateMutation.isPending}
			/>
		</div>
	);
}
