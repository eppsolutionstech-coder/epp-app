import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	CreditCard,
	Plus,
	Loader2,
	Percent,
	Pencil,
	Trash2,
	MoreVertical,
	Settings,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useGetFinancierConfigs,
	useCreateFinancierConfig,
	useUpdateFinancierConfig,
	useDeleteFinancierConfig,
} from "~/hooks/use-financier-config";
import type {
	FinancierConfigWithRelation,
	CreateFinancierConfig,
	UpdateFinancierConfig,
} from "~/zod/financier-config.zod";
import { FinancierConfigUpsertModal } from "./financier-config-upsert-modal";
import { toast } from "sonner";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-PH", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
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

export function FinancerLoanSettingsTab() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingConfig, setEditingConfig] = useState<FinancierConfigWithRelation | null>(null);

	const { data, isLoading, isError } = useGetFinancierConfigs();
	const configs = (data?.financierConfigs || []) as FinancierConfigWithRelation[];

	const createMutation = useCreateFinancierConfig();
	const updateMutation = useUpdateFinancierConfig();
	const deleteMutation = useDeleteFinancierConfig();

	const handleOpenCreate = () => {
		setEditingConfig(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (config: FinancierConfigWithRelation) => {
		setEditingConfig(config);
		setIsModalOpen(true);
	};

	const handleDelete = async (config: FinancierConfigWithRelation) => {
		if (confirm(`Are you sure you want to delete "${config.name}"?`)) {
			try {
				await deleteMutation.mutateAsync(config.id);
				toast.success("Configuration deleted successfully.");
			} catch {
				toast.error("Failed to delete configuration.");
			}
		}
	};

	const handleSubmit = async (data: CreateFinancierConfig | UpdateFinancierConfig) => {
		try {
			if (editingConfig) {
				await updateMutation.mutateAsync({
					financierConfigId: editingConfig.id,
					data: data as UpdateFinancierConfig,
				});
				toast.success("Configuration updated successfully.");
			} else {
				await createMutation.mutateAsync(data as CreateFinancierConfig);
				toast.success("Configuration created successfully.");
			}
			setIsModalOpen(false);
			setEditingConfig(null);
		} catch {
			toast.error(
				editingConfig
					? "Failed to update configuration."
					: "Failed to create configuration.",
			);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="h-8 w-48 bg-muted animate-pulse rounded" />
					<div className="h-10 w-40 bg-muted animate-pulse rounded" />
				</div>
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-40 w-full bg-muted animate-pulse rounded-lg" />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-16 space-y-4">
				<Settings className="h-12 w-12 text-muted-foreground opacity-50" />
				<p className="text-muted-foreground">Failed to load loan configurations.</p>
				<Button variant="outline" onClick={() => window.location.reload()}>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold tracking-tight">Loan Configurations</h2>
					<p className="text-sm text-muted-foreground">
						Manage your financing configurations, credit limits, and installment rates.
					</p>
				</div>
				<Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700">
					<Plus className="h-4 w-4 mr-2" />
					Add Configuration
				</Button>
			</div>

			{/* Empty State */}
			{configs.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<CreditCard className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
						<h3 className="text-lg font-medium mb-1">No configurations yet</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Create your first loan configuration to get started.
						</p>
						<Button
							onClick={handleOpenCreate}
							className="bg-emerald-600 hover:bg-emerald-700">
							<Plus className="h-4 w-4 mr-2" />
							Add Configuration
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Config Cards */}
			{configs.map((config) => {
				const utilization =
					config.maxCreditLimit > 0
						? Math.round(((config.usedCredits || 0) / config.maxCreditLimit) * 100)
						: 0;

				return (
					<Card key={config.id} className="overflow-hidden">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<CardTitle className="text-lg flex items-center gap-2">
										{config.name}
										{config.code && (
											<span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
												{config.code}
											</span>
										)}
									</CardTitle>
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
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleOpenEdit(config)}>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => handleDelete(config)}>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Credit Stats */}
							<div className="grid gap-4 md:grid-cols-3">
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<CreditCard className="h-3 w-3" />
										Credit Limit
									</p>
									<p className="text-lg font-semibold">
										{formatCurrency(config.maxCreditLimit || 0)}
									</p>
								</div>
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<CreditCard className="h-3 w-3 text-emerald-600" />
										Available
									</p>
									<p className="text-lg font-semibold text-emerald-600">
										{formatCurrency(config.availableCredits || 0)}
									</p>
								</div>
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<CreditCard className="h-3 w-3 text-blue-600" />
										Auto-Approve
									</p>
									<p className="text-lg font-semibold">
										{formatCurrency(config.autoApproveLimit || 0)}
									</p>
								</div>
							</div>

							{/* Credit Utilization Bar */}
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{formatCurrency(config.usedCredits || 0)} used</span>
									<span>{utilization}%</span>
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
									<div className="space-y-2">
										<p className="text-xs text-muted-foreground flex items-center gap-1">
											<Percent className="h-3 w-3" />
											Installment Rates
										</p>
										<div className="flex flex-wrap gap-2">
											{config.installmentRateConfig.map((tier) => (
												<Badge
													key={tier.installmentCount}
													variant="outline"
													className="bg-emerald-50 border-emerald-200 text-emerald-700">
													{tier.installmentCount}{" "}
													{tier.installmentCount > 1
														? "installments"
														: "installment"}{" "}
													@ {tier.rate}%
												</Badge>
											))}
										</div>
									</div>
								)}

							{/* Notes */}
							{config.notes && (
								<p className="text-xs text-muted-foreground border-t pt-3">
									{config.notes}
								</p>
							)}
						</CardContent>
					</Card>
				);
			})}

			{/* Upsert Modal */}
			<FinancierConfigUpsertModal
				open={isModalOpen}
				onOpenChange={(open) => {
					setIsModalOpen(open);
					if (!open) setEditingConfig(null);
				}}
				config={editingConfig}
				onSubmit={handleSubmit}
				isLoading={createMutation.isPending || updateMutation.isPending}
			/>
		</div>
	);
}
