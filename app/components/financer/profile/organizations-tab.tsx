import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type {
	FinancierConfigWithRelation,
	CreateFinancierConfig,
	UpdateFinancierConfig,
} from "~/zod/financier-config.zod";
import { useGetFinancierConfigs, useCreateFinancierConfig } from "~/hooks/use-financier-config";
import { OrganizationUpsertModal } from "./organization-upsert-modal";

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

export function FinancerOrganizationsTab() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch data from API
	const { data, isLoading, isError } = useGetFinancierConfigs({ limit: 100 });
	const organizations = data?.financierConfigs || [];

	// Mutation hooks
	const createMutation = useCreateFinancierConfig();

	const handleOpenCreate = () => {
		setIsModalOpen(true);
	};

	const handleSubmit = async (data: CreateFinancierConfig | UpdateFinancierConfig) => {
		try {
			await createMutation.mutateAsync(data as CreateFinancierConfig);
			toast.success("Organization created successfully");
			setIsModalOpen(false);
		} catch (error: any) {
			toast.error(error.message || "Failed to create organization");
		}
	};

	const isSubmitting = createMutation.isPending;

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

			{/* Simplified Organization Cards Grid */}
			{!isLoading && !isError && organizations.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2">
					{organizations.map((config) => (
						<Link
							key={config.id}
							to={`/financer/organization/${config.id}`}
							className="block">
							<Card
								className={`transition-all hover:shadow-md hover:border-emerald-300 cursor-pointer ${!config.isActive ? "opacity-60" : ""}`}>
								<CardContent className="p-4">
									<div className="flex items-center gap-4">
										{/* Avatar */}
										<div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
											{config.name.charAt(0)}
										</div>

										{/* Info */}
										<div className="flex-1 min-w-0">
											<h3
												className="font-semibold mb-2 line-clamp-2 leading-tight"
												title={config.name}>
												{config.name}
											</h3>
											<div className="flex items-center gap-2 flex-wrap">
												<Badge
													className={`${getUserTypeBadgeStyle(config.userType)} text-xs`}>
													{config.userType}
												</Badge>
											</div>
										</div>

										{/* Arrow */}
										<ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}

			{/* Create Modal */}
			<OrganizationUpsertModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				organization={null}
				onSubmit={handleSubmit}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
