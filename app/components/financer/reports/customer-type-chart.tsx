import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CustomerTypeChartProps {
	loansByType: {
		employee: number;
		retailer: number;
		wholesaler: number;
		regular: number;
	};
}

export function CustomerTypeChart({ loansByType }: CustomerTypeChartProps) {
	const data = [
		{ name: "Employee", value: loansByType.employee, color: "var(--chart-1)" },
		{ name: "Retailer", value: loansByType.retailer, color: "var(--chart-2)" },
		{ name: "Wholesaler", value: loansByType.wholesaler, color: "var(--chart-3)" },
		{ name: "Regular", value: loansByType.regular, color: "var(--chart-4)" },
	];

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Loans by Customer Type</CardTitle>
				<CardDescription>Distribution across customer segments</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<div className="h-[250px] w-full mt-4">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data} layout="vertical" margin={{ left: 20 }}>
							<CartesianGrid strokeDasharray="3 3" horizontal={false} />
							<XAxis type="number" hide />
							<YAxis
								dataKey="name"
								type="category"
								axisLine={false}
								tickLine={false}
								width={80}
							/>
							<Tooltip
								cursor={{ fill: "transparent" }}
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									borderColor: "hsl(var(--border))",
									borderRadius: "var(--radius)",
								}}
								itemStyle={{ color: "hsl(var(--foreground))" }}
							/>
							<Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
