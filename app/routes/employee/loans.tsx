import type { Route } from "./+types/loans";
import { LoanOptionsGrid } from "~/components/employee/loans/loan-options-grid";
import { LoanCalculator } from "~/components/employee/loans/loan-calculator";
import { ApplicationSteps } from "~/components/employee/loans/application-steps";
import { ActiveLoansSummary } from "~/components/employee/loans/active-loans-summary";

export function meta({}: Route.MetaArgs) {
	return [{ title: "Employee Loans | EPP" }];
}

export default function EmployeeLoansPage() {
	return (
		<div className="space-y-8 pb-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Financial Services</h1>
				<p className="text-muted-foreground">
					Manage your loans and explore financial solutions tailored for you.
				</p>
			</div>

			{/* Top Section: Active Summary */}
			<ActiveLoansSummary />

			{/* Middle Section: Split Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-12">
					<ApplicationSteps /> {/* Steps with dark styling */}
					<LoanOptionsGrid /> {/* Loan type cards */}
				</div>

				<div className="lg:col-span-1">
					<div className="sticky top-6">
						<LoanCalculator />
					</div>
				</div>
			</div>
		</div>
	);
}
