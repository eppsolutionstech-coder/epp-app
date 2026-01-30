import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function LoanCalculator() {
	const [amount, setAmount] = useState([10000]);
	const [months, setMonths] = useState("6");
	const interestRate = 0.035; // 3.5% monthly interest

	const principal = amount[0];
	const term = parseInt(months);
	const totalInterest = principal * interestRate * term;
	const totalAmount = principal + totalInterest;
	const monthlyPayment = totalAmount / term;

	return (
		<Card className="h-full border-muted/40 shadow-sm bg-card/50 backdrop-blur-sm">
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="p-2 bg-primary/10 rounded-lg text-primary">
						<Calculator className="h-5 w-5" />
					</div>
					<div>
						<CardTitle>Loan Calculator</CardTitle>
						<CardDescription>Estimate your monthly deductions</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				{/* Amount Slider */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<Label className="text-base font-medium">Loan Amount</Label>
						<div className="text-xl font-bold text-primary">
							₱{principal.toLocaleString()}
						</div>
					</div>
					<Slider
						value={amount}
						min={5000}
						max={50000}
						step={1000}
						onValueChange={setAmount}
						className="py-4"
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>₱5,000</span>
						<span>₱50,000</span>
					</div>
				</div>

				{/* Term Select */}
				<div className="space-y-4">
					<Label className="text-base font-medium">Repayment Period</Label>
					<Select value={months} onValueChange={setMonths}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select months" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="3">3 Months</SelectItem>
							<SelectItem value="6">6 Months</SelectItem>
							<SelectItem value="12">12 Months</SelectItem>
							<SelectItem value="24">24 Months</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Summary Box */}
				<div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground">Monthly Interest Rate</span>
						<span className="font-medium">3.5%</span>
					</div>
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground">Total Interest</span>
						<span className="font-medium">₱{totalInterest.toLocaleString()}</span>
					</div>
					<div className="h-px bg-border/50" />
					<div className="flex justify-between items-center">
						<span className="font-medium">Monthly Payment</span>
						<span className="text-xl font-bold text-primary">
							₱
							{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</span>
					</div>
				</div>

				<Button className="w-full">Apply for this Amount</Button>
			</CardContent>
		</Card>
	);
}
