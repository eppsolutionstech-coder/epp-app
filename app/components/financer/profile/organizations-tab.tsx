import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, TrendingUp, Users, Plus, MoreVertical } from "lucide-react";
import type { FinancierConfigWithRelation } from "~/zod/financier-config.zod";

// Mock data - replace with actual API call using useGetFinancierConfigs
const mockOrganizationConfigs: FinancierConfigWithRelation[] = [
	{
		id: "1",
		organizationId: "org-001",
		userId: "user-001",
		userType: "EMPLOYEE",
		name: "Acme Corporation",
		code: "ACME-001",
		isActive: true,
		maxCreditLimit: 500000,
		usedCredits: 125000,
		availableCredits: 375000,
		autoApproveLimit: 50000,
		installmentRateConfig: [
			{ installmentCount: 3, rate: 1.5 },
			{ installmentCount: 6, rate: 2.0 },
			{ installmentCount: 12, rate: 3.0 },
		],
		notes: "Primary partner organization",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-12-01"),
	},
	{
		id: "2",
		organizationId: "org-002",
		userId: "user-002",
		userType: "WHOLESALER",
		name: "Global Trade Inc.",
		code: "GTI-002",
		isActive: true,
		maxCreditLimit: 1000000,
		usedCredits: 450000,
		availableCredits: 550000,
		autoApproveLimit: 100000,
		installmentRateConfig: [
			{ installmentCount: 3, rate: 1.0 },
			{ installmentCount: 6, rate: 1.5 },
			{ installmentCount: 12, rate: 2.5 },
		],
		notes: "High-volume B2B partner",
		createdAt: new Date("2024-03-20"),
		updatedAt: new Date("2024-11-15"),
	},
	{
		id: "3",
		organizationId: "org-003",
		userId: "user-003",
		userType: "INDIVIDUAL",
		name: "Metro Retail Group",
		code: "MRG-003",
		isActive: false,
		maxCreditLimit: 250000,
		usedCredits: 250000,
		availableCredits: 0,
		autoApproveLimit: 25000,
		installmentRateConfig: [
			{ installmentCount: 3, rate: 2.0 },
			{ installmentCount: 6, rate: 2.5 },
		],
		notes: "Credit limit fully utilized",
		createdAt: new Date("2024-02-10"),
		updatedAt: new Date("2024-10-20"),
	},
	{
		id: "4",
		organizationId: "org-004",
		userId: "user-004",
		userType: "EMPLOYEE",
		name: "TechStart Solutions",
		code: "TSS-004",
		isActive: true,
		maxCreditLimit: 300000,
		usedCredits: 75000,
		availableCredits: 225000,
		autoApproveLimit: 30000,
		installmentRateConfig: [
			{ installmentCount: 6, rate: 1.8 },
			{ installmentCount: 12, rate: 2.8 },
		],
		notes: "Tech industry partner",
		createdAt: new Date("2024-05-01"),
		updatedAt: new Date("2024-12-05"),
	},
];

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
	// TODO: Replace with actual API call
	// const { data, isLoading } = useGetFinancierConfigs();

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
				<Button className="bg-emerald-600 hover:bg-emerald-700">
					<Plus className="h-4 w-4 mr-2" />
					Add Organization
				</Button>
			</div>

			{/* Organization Cards Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{mockOrganizationConfigs.map((config) => {
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
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreVertical className="h-4 w-4" />
									</Button>
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
										<span className="text-muted-foreground">Credit Limit</span>
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
		</div>
	);
}
