import { CreditCard, Wallet, TrendingUp } from "lucide-react";
import { CreditUsageProgress } from "~/components/molecule/credit-usage-progress";
import { StatsCard } from "~/components/molecule/stats-card";
import type { Employee, EmployeePurchase } from "~/data/mock-admin-data";

interface ProfileCreditTabProps {
	employee: Employee;
	purchases: EmployeePurchase[];
	availableCredit: number;
}

export function ProfileCreditTab({ employee, purchases, availableCredit }: ProfileCreditTabProps) {
	const monthlyPayment = purchases
		.filter((p) => p.status === "active")
		.reduce((sum, p) => sum + p.monthlyPayment, 0);

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">EPP Credit</h2>

			{/* Stats Cards */}
			<div className="grid gap-4 sm:grid-cols-2">
				<StatsCard
					title="Credit Limit"
					value={`$${employee.creditLimit.toLocaleString()}`}
					description="Total approved limit"
					icon={CreditCard}
					color="text-blue-600"
					bgColor="bg-blue-50 dark:bg-blue-950/50"
				/>
				<StatsCard
					title="Used Amount"
					value={`$${employee.usedAmount.toLocaleString()}`}
					description="Currently utilized"
					icon={Wallet}
					color="text-amber-600"
					bgColor="bg-amber-50 dark:bg-amber-950/50"
				/>
				<StatsCard
					title="Available Credit"
					value={`$${availableCredit.toLocaleString()}`}
					description="Ready to use"
					icon={TrendingUp}
					color="text-emerald-600"
					bgColor="bg-emerald-50 dark:bg-emerald-950/50"
				/>
				<StatsCard
					title="Monthly Payment"
					value={`$${monthlyPayment.toFixed(2)}`}
					description="Due this month"
					icon={CreditCard}
					color="text-purple-600"
					bgColor="bg-purple-50 dark:bg-purple-950/50"
				/>
			</div>

			{/* Credit Usage Progress */}
			<CreditUsageProgress
				usedAmount={employee.usedAmount}
				creditLimit={employee.creditLimit}
			/>
		</div>
	);
}
