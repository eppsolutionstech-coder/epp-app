import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CreditUsageProgressProps {
	usedAmount: number;
	creditLimit: number;
}

export function CreditUsageProgress({ usedAmount, creditLimit }: CreditUsageProgressProps) {
	const availableCredit = creditLimit - usedAmount;
	const usagePercentage = (usedAmount / creditLimit) * 100;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Credit Limit Usage</CardTitle>
				<CardDescription>
					You've used ${usedAmount.toLocaleString()} of your $
					{creditLimit.toLocaleString()} credit limit
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Progress value={usagePercentage} className="h-3" />
				<div className="flex justify-between mt-2 text-sm text-muted-foreground">
					<span>Used: ${usedAmount.toLocaleString()}</span>
					<span>Available: ${availableCredit.toLocaleString()}</span>
				</div>
			</CardContent>
		</Card>
	);
}
