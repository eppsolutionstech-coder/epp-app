import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Percent, Calendar, CheckCircle, Save, Settings } from "lucide-react";
import { INTEREST_RATES, LOAN_TERMS } from "~/data/mock-financer-data";

export function FinancerLoanSettingsTab() {
	const [interestRates, setInterestRates] = useState<{
		employee: number;
		retailer: number;
		wholesaler: number;
		regular: number;
	}>({
		employee: INTEREST_RATES.employee,
		retailer: INTEREST_RATES.retailer,
		wholesaler: INTEREST_RATES.wholesaler,
		regular: INTEREST_RATES.regular,
	});

	const [enabledTerms, setEnabledTerms] = useState<number[]>([...LOAN_TERMS]);

	const toggleTerm = (term: number) => {
		setEnabledTerms((prev) =>
			prev.includes(term)
				? prev.filter((t) => t !== term)
				: [...prev, term].sort((a, b) => a - b),
		);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Percent className="h-5 w-5" />
						Interest Rates by Customer Type
					</CardTitle>
					<CardDescription>
						Configure the annual interest rate for each customer type. Lower rates for
						lower-risk customers.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3 p-4 border rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Employee</p>
									<p className="text-sm text-muted-foreground">
										Low risk - Salary deduction available
									</p>
								</div>
								<Badge className="bg-blue-100 text-blue-700">Low Risk</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={interestRates.employee}
									onChange={(e) =>
										setInterestRates((prev) => ({
											...prev,
											employee: Number(e.target.value),
										}))
									}
									className="w-24"
									min={0}
									max={100}
									step={0.5}
								/>
								<span className="text-muted-foreground">% annually</span>
							</div>
						</div>

						<div className="space-y-3 p-4 border rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Wholesaler</p>
									<p className="text-sm text-muted-foreground">
										Lowest risk - Established businesses
									</p>
								</div>
								<Badge className="bg-cyan-100 text-cyan-700">Lowest Risk</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={interestRates.wholesaler}
									onChange={(e) =>
										setInterestRates((prev) => ({
											...prev,
											wholesaler: Number(e.target.value),
										}))
									}
									className="w-24"
									min={0}
									max={100}
									step={0.5}
								/>
								<span className="text-muted-foreground">% annually</span>
							</div>
						</div>

						<div className="space-y-3 p-4 border rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Retailer</p>
									<p className="text-sm text-muted-foreground">
										Medium risk - Business income variability
									</p>
								</div>
								<Badge className="bg-purple-100 text-purple-700">Medium Risk</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={interestRates.retailer}
									onChange={(e) =>
										setInterestRates((prev) => ({
											...prev,
											retailer: Number(e.target.value),
										}))
									}
									className="w-24"
									min={0}
									max={100}
									step={0.5}
								/>
								<span className="text-muted-foreground">% annually</span>
							</div>
						</div>

						<div className="space-y-3 p-4 border rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Regular User</p>
									<p className="text-sm text-muted-foreground">
										High risk - No guaranteed income source
									</p>
								</div>
								<Badge className="bg-gray-100 text-gray-700">High Risk</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={interestRates.regular}
									onChange={(e) =>
										setInterestRates((prev) => ({
											...prev,
											regular: Number(e.target.value),
										}))
									}
									className="w-24"
									min={0}
									max={100}
									step={0.5}
								/>
								<span className="text-muted-foreground">% annually</span>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<Button className="bg-emerald-600 hover:bg-emerald-700">
							<Save className="h-4 w-4 mr-2" />
							Save Interest Rates
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Available Installment Terms
					</CardTitle>
					<CardDescription>
						Select which installment terms are available for customers to choose from.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-5">
						{[3, 6, 12, 18, 24].map((term) => (
							<div
								key={term}
								onClick={() => toggleTerm(term)}
								className={`p-4 border rounded-lg cursor-pointer transition-all ${
									enabledTerms.includes(term)
										? "border-emerald-500 bg-emerald-50"
										: "border-gray-200 hover:border-gray-300"
								}`}>
								<div className="flex items-center justify-between mb-2">
									<span className="text-2xl font-bold">{term}</span>
									{enabledTerms.includes(term) && (
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
						))}
					</div>

					<div className="p-4 bg-muted/50 rounded-lg">
						<p className="text-sm font-medium mb-2">Currently Enabled Terms:</p>
						<div className="flex flex-wrap gap-2">
							{enabledTerms.length > 0 ? (
								enabledTerms.map((term) => (
									<Badge key={term} variant="outline" className="bg-white">
										{term} months
									</Badge>
								))
							) : (
								<span className="text-sm text-muted-foreground">
									No terms enabled
								</span>
							)}
						</div>
					</div>

					<div className="flex justify-end">
						<Button className="bg-emerald-600 hover:bg-emerald-700">
							<Save className="h-4 w-4 mr-2" />
							Save Installment Terms
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Credit Score Thresholds
					</CardTitle>
					<CardDescription>
						Configure minimum credit score requirements for loan approval.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label>Auto-Approve Threshold</Label>
							<div className="flex items-center gap-2">
								<Input type="number" defaultValue={750} className="w-24" />
								<span className="text-sm text-muted-foreground">
									Score 750+ auto-approved
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Manual Review Threshold</Label>
							<div className="flex items-center gap-2">
								<Input type="number" defaultValue={650} className="w-24" />
								<span className="text-sm text-muted-foreground">
									Score 650-749 requires review
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Auto-Reject Threshold</Label>
							<div className="flex items-center gap-2">
								<Input type="number" defaultValue={550} className="w-24" />
								<span className="text-sm text-muted-foreground">
									Score below 550 auto-rejected
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Maximum Loan-to-Income Ratio</Label>
							<div className="flex items-center gap-2">
								<Input type="number" defaultValue={30} className="w-24" />
								<span className="text-sm text-muted-foreground">
									% of monthly salary
								</span>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<Button className="bg-emerald-600 hover:bg-emerald-700">
							<Save className="h-4 w-4 mr-2" />
							Save Thresholds
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
