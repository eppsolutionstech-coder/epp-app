import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoanStatusChartProps {
	activeCount: number;
	completedCount: number;
	defaultedCount: number;
}

export function LoanStatusChart({
	activeCount,
	completedCount,
	defaultedCount,
}: LoanStatusChartProps) {
	const data = [
		{ name: "Active", value: activeCount, color: "#3b82f6" }, // Blue
		{ name: "Completed", value: completedCount, color: "#22c55e" }, // Green
		{ name: "Defaulted", value: defaultedCount, color: "#ef4444" }, // Red
	];

	const total = activeCount + completedCount + defaultedCount;

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Loan Status Distribution</CardTitle>
				<CardDescription>Breakdown of loans by current status</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<div className="h-[250px] w-full mt-4">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value">
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip
								formatter={(value: number) => [
									`${value} (${((value / total) * 100).toFixed(1)}%)`,
									"Loans",
								]}
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									borderColor: "hsl(var(--border))",
									borderRadius: "var(--radius)",
								}}
								itemStyle={{ color: "hsl(var(--foreground))" }}
							/>
							<Legend verticalAlign="bottom" height={36} />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
