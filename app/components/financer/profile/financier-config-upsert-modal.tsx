import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Loader2, X, CheckCircle } from "lucide-react";
import type {
	FinancierConfigWithRelation,
	CreateFinancierConfig,
	UpdateFinancierConfig,
	InstallmentRateTier,
	UserType,
} from "~/zod/financier-config.zod";
import { useAuth } from "~/hooks/use-auth";

interface FinancierConfigUpsertModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	config?: FinancierConfigWithRelation | null;
	onSubmit: (data: CreateFinancierConfig | UpdateFinancierConfig) => void;
	isLoading?: boolean;
}

interface FormData {
	name: string;
	code: string;
	userType: UserType;
	isActive: boolean;
	maxCreditLimit: string;
	autoApproveLimit: string;
	installmentRateConfig: InstallmentRateTier[];
	notes: string;
}

const initialFormData: FormData = {
	name: "",
	code: "",
	userType: "EMPLOYEE",
	isActive: true,
	maxCreditLimit: "",
	autoApproveLimit: "",
	installmentRateConfig: [],
	notes: "",
};

const defaultInstallmentTerms = [3, 6, 12, 18, 24];

export function FinancierConfigUpsertModal({
	open,
	onOpenChange,
	config,
	onSubmit,
	isLoading = false,
}: FinancierConfigUpsertModalProps) {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [newTierMonths, setNewTierMonths] = useState<string>("");
	const [newTierRate, setNewTierRate] = useState<string>("");

	const { user } = useAuth();
	const isEditing = !!config;

	useEffect(() => {
		if (open) {
			if (config) {
				setFormData({
					name: config.name,
					code: config.code || "",
					userType: config.userType,
					isActive: config.isActive,
					maxCreditLimit: String(config.maxCreditLimit || ""),
					autoApproveLimit: String(config.autoApproveLimit || ""),
					installmentRateConfig: config.installmentRateConfig || [],
					notes: config.notes || "",
				});
			} else {
				setFormData(initialFormData);
			}
			setNewTierMonths("");
			setNewTierRate("");
		}
	}, [open, config]);

	const handleAddInstallmentTier = () => {
		const months = parseInt(newTierMonths);
		const rate = parseFloat(newTierRate);

		if (months > 0 && rate >= 0) {
			const exists = formData.installmentRateConfig.some(
				(tier) => tier.installmentCount === months,
			);
			if (!exists) {
				setFormData({
					...formData,
					installmentRateConfig: [
						...formData.installmentRateConfig,
						{ installmentCount: months, rate },
					].sort((a, b) => a.installmentCount - b.installmentCount),
				});
				setNewTierMonths("");
				setNewTierRate("");
			}
		}
	};

	const handleRemoveInstallmentTier = (installmentCount: number) => {
		setFormData({
			...formData,
			installmentRateConfig: formData.installmentRateConfig.filter(
				(tier) => tier.installmentCount !== installmentCount,
			),
		});
	};

	const handleSubmit = () => {
		const submitData: CreateFinancierConfig = {
			organizationId: null,
			userId: user?.id || "",
			userType: formData.userType,
			name: formData.name,
			code: formData.code || null,
			isActive: formData.isActive,
			maxCreditLimit: parseFloat(formData.maxCreditLimit) || 0,
			usedCredits: 0,
			availableCredits: parseFloat(formData.maxCreditLimit) || 0,
			autoApproveLimit: parseFloat(formData.autoApproveLimit) || 0,
			installmentRateConfig:
				formData.installmentRateConfig.length > 0
					? formData.installmentRateConfig
					: null,
			notes: formData.notes || null,
		};
		onSubmit(submitData);
	};

	const handleClose = () => {
		onOpenChange(false);
		setFormData(initialFormData);
	};

	const isFormValid =
		formData.name.trim() &&
		formData.maxCreditLimit &&
		formData.autoApproveLimit;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto minimal-scrollbar">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Loan Configuration" : "Add Loan Configuration"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the loan financing configuration."
							: "Create a new loan financing configuration."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							Basic Information
						</h3>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="configName">Configuration Name *</Label>
								<Input
									id="configName"
									placeholder="e.g., Default Loan Config"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									disabled={isLoading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="code">Code</Label>
								<Input
									id="code"
									placeholder="Optional code"
									value={formData.code}
									onChange={(e) =>
										setFormData({ ...formData, code: e.target.value })
									}
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="userType">User Type *</Label>
								<Select
									value={formData.userType}
									onValueChange={(value: UserType) =>
										setFormData({ ...formData, userType: value })
									}
									disabled={isLoading}>
									<SelectTrigger>
										<SelectValue placeholder="Select user type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="EMPLOYEE">Employee</SelectItem>
										<SelectItem value="INDIVIDUAL">Individual</SelectItem>
										<SelectItem value="WHOLESALER">Wholesaler</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<p className="font-medium">Active Status</p>
								<p className="text-sm text-muted-foreground">
									Enable or disable this loan configuration
								</p>
							</div>
							<Switch
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, isActive: checked })
								}
								disabled={isLoading}
							/>
						</div>
					</div>

					{/* Credit Settings */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							Credit Settings
						</h3>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="maxCreditLimit">
									Maximum Credit Limit (₱) *
								</Label>
								<Input
									id="maxCreditLimit"
									type="number"
									placeholder="0.00"
									value={formData.maxCreditLimit}
									onChange={(e) =>
										setFormData({
											...formData,
											maxCreditLimit: e.target.value,
										})
									}
									disabled={isLoading}
								/>
								<p className="text-xs text-muted-foreground">
									Total credit available for this configuration
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="autoApproveLimit">
									Auto-Approve Limit (₱) *
								</Label>
								<Input
									id="autoApproveLimit"
									type="number"
									placeholder="0.00"
									value={formData.autoApproveLimit}
									onChange={(e) =>
										setFormData({
											...formData,
											autoApproveLimit: e.target.value,
										})
									}
									disabled={isLoading}
								/>
								<p className="text-xs text-muted-foreground">
									Loans below this amount are auto-approved
								</p>
							</div>
						</div>
					</div>

					{/* Installment Rate Configuration */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Installment Rate Configuration
							</h3>
						</div>

						<p className="text-xs text-muted-foreground">
							Click to enable installment terms and set their interest rates:
						</p>

						<div className="grid gap-4 md:grid-cols-5">
							{defaultInstallmentTerms.map((term) => {
								const existingTier = formData.installmentRateConfig.find(
									(tier) => tier.installmentCount === term,
								);
								const isEnabled = !!existingTier;

								const handleToggle = () => {
									if (isEnabled) {
										setFormData({
											...formData,
											installmentRateConfig:
												formData.installmentRateConfig.filter(
													(tier) => tier.installmentCount !== term,
												),
										});
									} else {
										const defaultRate =
											term <= 6 ? 1.5 : term <= 12 ? 2.0 : 2.5;
										setFormData({
											...formData,
											installmentRateConfig: [
												...formData.installmentRateConfig,
												{ installmentCount: term, rate: defaultRate },
											].sort(
												(a, b) => a.installmentCount - b.installmentCount,
											),
										});
									}
								};

								return (
									<div
										key={term}
										className={`p-4 border rounded-lg cursor-pointer transition-all ${
											isEnabled
												? "border-emerald-500 bg-emerald-50"
												: "border-gray-200 hover:border-gray-300"
										}`}>
										<div onClick={handleToggle} className="cursor-pointer">
											<div className="flex items-center justify-between mb-2">
												<span className="text-2xl font-bold">{term}</span>
												{isEnabled && (
													<CheckCircle className="h-5 w-5 text-emerald-600" />
												)}
											</div>
											<p className="text-sm text-muted-foreground">months</p>
											<p className="text-xs text-muted-foreground mt-1">
												{term <= 6
													? "Short-term"
													: term <= 12
														? "Standard"
														: "Extended"}
											</p>
										</div>

										{isEnabled && (
											<div
												className="mt-3 pt-3 border-t border-emerald-200"
												onClick={(e) => e.stopPropagation()}>
												<div className="flex items-center gap-2">
													<Input
														type="number"
														value={existingTier?.rate ?? ""}
														onChange={(e) => {
															const newRate =
																parseFloat(e.target.value) || 0;
															setFormData({
																...formData,
																installmentRateConfig:
																	formData.installmentRateConfig.map(
																		(tier) =>
																			tier.installmentCount ===
																			term
																				? {
																						...tier,
																						rate: newRate,
																					}
																				: tier,
																	),
															});
														}}
														disabled={isLoading}
														step={0.1}
														min={0}
														className="w-full h-8 text-sm"
														placeholder="0.0"
													/>
													<span className="text-sm text-muted-foreground">
														%
													</span>
												</div>
											</div>
										)}
									</div>
								);
							})}
						</div>

						{/* Custom Rate Input */}
						<div className="p-4 border rounded-lg bg-muted/30">
							<p className="text-sm font-medium mb-3">Add Custom Term</p>
							<p className="text-xs text-muted-foreground mb-3">
								Add a custom installment term not listed above
							</p>
							<div className="flex items-end gap-3">
								<div className="space-y-1 flex-1">
									<Label htmlFor="tierMonths" className="text-xs">
										Months
									</Label>
									<Input
										id="tierMonths"
										type="number"
										placeholder="e.g., 9"
										value={newTierMonths}
										onChange={(e) => setNewTierMonths(e.target.value)}
										disabled={isLoading}
										min={1}
									/>
								</div>
								<div className="space-y-1 flex-1">
									<Label htmlFor="tierRate" className="text-xs">
										Rate (%)
									</Label>
									<Input
										id="tierRate"
										type="number"
										placeholder="e.g., 2.5"
										value={newTierRate}
										onChange={(e) => setNewTierRate(e.target.value)}
										disabled={isLoading}
										step={0.1}
										min={0}
									/>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={handleAddInstallmentTier}
									disabled={
										isLoading ||
										!newTierMonths ||
										!newTierRate ||
										parseInt(newTierMonths) <= 0
									}>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Custom terms (non-default) */}
						{formData.installmentRateConfig.filter(
							(tier) => !defaultInstallmentTerms.includes(tier.installmentCount),
						).length > 0 && (
							<div className="space-y-2">
								<p className="text-xs text-muted-foreground">Custom terms:</p>
								<div className="flex flex-wrap gap-2">
									{formData.installmentRateConfig
										.filter(
											(tier) =>
												!defaultInstallmentTerms.includes(
													tier.installmentCount,
												),
										)
										.map((tier) => (
											<div
												key={tier.installmentCount}
												className="flex items-center gap-2 p-2 border rounded-lg bg-blue-50/50 border-blue-200">
												<span className="text-sm font-medium">
													{tier.installmentCount}mo
												</span>
												<Input
													type="number"
													value={tier.rate}
													onChange={(e) => {
														const newRate =
															parseFloat(e.target.value) || 0;
														setFormData({
															...formData,
															installmentRateConfig:
																formData.installmentRateConfig.map(
																	(t) =>
																		t.installmentCount ===
																		tier.installmentCount
																			? {
																					...t,
																					rate: newRate,
																				}
																			: t,
																),
														});
													}}
													disabled={isLoading}
													step={0.1}
													min={0}
													className="w-20 h-8"
												/>
												<span className="text-xs text-muted-foreground">
													%
												</span>
												<button
													type="button"
													onClick={() =>
														handleRemoveInstallmentTier(
															tier.installmentCount,
														)
													}
													disabled={isLoading}
													className="p-1 hover:text-destructive transition-colors">
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
								</div>
							</div>
						)}
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Add any additional notes about this configuration..."
							rows={3}
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							disabled={isLoading}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						className="bg-emerald-600 hover:bg-emerald-700">
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : isEditing ? (
							<Save className="mr-2 h-4 w-4" />
						) : (
							<Plus className="mr-2 h-4 w-4" />
						)}
						{isEditing ? "Save Changes" : "Add Configuration"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
