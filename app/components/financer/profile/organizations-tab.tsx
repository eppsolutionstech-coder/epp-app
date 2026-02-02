import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import type {
	FinancierConfigWithRelation,
	CreateFinancierConfig,
	UpdateFinancierConfig,
} from "~/zod/financier-config.zod";
import {
	useGetFinancierConfigs,
	useCreateFinancierConfig,
	useUpdateFinancierConfig,
	useDeleteFinancierConfig,
} from "~/hooks/use-financier-config";
import { OrganizationUpsertModal } from "./organization-upsert-modal";

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

export function FinancerOrganizationsTab() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrganization, setSelectedOrganization] =
		useState<FinancierConfigWithRelation | null>(null);

	// Fetch data from API
	const { data, isLoading, isError } = useGetFinancierConfigs({ limit: 100 });
	const organizations = data?.financierConfigs || [];

	// Mutation hooks
	const createMutation = useCreateFinancierConfig();
	const updateMutation = useUpdateFinancierConfig();
	const deleteMutation = useDeleteFinancierConfig();

	const handleOpenCreate = () => {
		setSelectedOrganization(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (org: FinancierConfigWithRelation) => {
		setSelectedOrganization(org);
		setIsModalOpen(true);
	};

	const handleDelete = async (orgId: string, orgName: string) => {
		if (confirm(`Are you sure you want to delete "${orgName}"?`)) {
			try {
				await deleteMutation.mutateAsync(orgId);
				toast.success("Organization deleted successfully");
			} catch (error: any) {
				toast.error(error.message || "Failed to delete organization");
			}
		}
	};

	const handleSubmit = async (data: CreateFinancierConfig | UpdateFinancierConfig) => {
		try {
			if (selectedOrganization) {
				// Update
				await updateMutation.mutateAsync({
					financierConfigId: selectedOrganization.id,
					data: data as UpdateFinancierConfig,
				});
				toast.success("Organization updated successfully");
			} else {
				// Create
				await createMutation.mutateAsync(data as CreateFinancierConfig);
				toast.success("Organization created successfully");
			}
			setIsModalOpen(false);
			setSelectedOrganization(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to save organization");
		}
	};

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold">Organizations</h2>
					<p className="text-sm text-muted-foreground">
						Manage financing configurations for partner organizations
					</p>
				</div>
				<Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleOpenCreate}>
					<Plus className="h-4 w-4 mr-2" />
					Add Organization
				</Button>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
				</div>
			)}

			{/* Error State */}
			{isError && (
				<div className="text-center py-12">
					<p className="text-destructive">Failed to load organizations</p>
				</div>
			)}

			{/* Empty State */}
			{!isLoading && !isError && organizations.length === 0 && (
				<div className="text-center py-12">
					<Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<p className="text-muted-foreground">No organizations yet</p>
					<p className="text-sm text-muted-foreground">
						Click "Add Organization" to create one
					</p>
				</div>
			)}

			{/* Organization Cards Grid */}
			{!isLoading && !isError && organizations.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{organizations.map((config) => {
						const utilization = getUtilizationPercentage(
							config.usedCredits || 0,
							config.maxCreditLimit || 0,
						);

						return (
							<Card
								key={config.id}
								className={`transition-all hover:shadow-md ${!config.isActive ? "opacity-60" : ""}`}>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-3">
											<div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
												{config.name.charAt(0)}
											</div>
											<div>
												<CardTitle className="text-base">
													{config.name}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													{config.code}
												</p>
											</div>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => handleOpenEdit(config)}>
													<Pencil className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onClick={() =>
														handleDelete(config.id, config.name)
													}>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Status & Type Badges */}
									<div className="flex items-center gap-2">
										<Badge className={getUserTypeBadgeStyle(config.userType)}>
											{config.userType}
										</Badge>
										<Badge
											variant={config.isActive ? "default" : "secondary"}
											className={
												config.isActive ? "bg-green-100 text-green-700" : ""
											}>
											{config.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>

									{/* Credit Info */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Credit Limit
											</span>
											<span className="font-medium">
												{formatCurrency(config.maxCreditLimit || 0)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Available</span>
											<span className="font-medium text-emerald-600">
												{formatCurrency(config.availableCredits || 0)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Auto-Approve Limit
											</span>
											<span className="font-medium">
												{formatCurrency(config.autoApproveLimit || 0)}
											</span>
										</div>
									</div>

									{/* Utilization Bar */}
									<div className="space-y-1">
										<div className="flex justify-between text-xs">
											<span className="text-muted-foreground">
												Credit Utilization
											</span>
											<span className="font-medium">{utilization}%</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
									</div>

									{/* Installment Rates */}
									{config.installmentRateConfig &&
										config.installmentRateConfig.length > 0 && (
											<div className="pt-2 border-t">
												<p className="text-xs text-muted-foreground mb-2">
													Installment Rates
												</p>
												<div className="flex flex-wrap gap-1">
													{config.installmentRateConfig.map((tier) => (
														<Badge
															key={tier.installmentCount}
															variant="outline"
															className="text-xs">
															{tier.installmentCount}mo @ {tier.rate}%
														</Badge>
													))}
												</div>
											</div>
										)}

									{/* Notes */}
									{config.notes && (
										<p className="text-xs text-muted-foreground italic pt-2 border-t">
											{config.notes}
										</p>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* Upsert Modal */}
			<OrganizationUpsertModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				organization={selectedOrganization}
				onSubmit={handleSubmit}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
