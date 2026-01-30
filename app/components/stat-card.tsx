import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	description: string;
	trend: "up" | "down" | "neutral";
	icon: LucideIcon;
	color: string;
	bg: string;
	border: string;
}

export function StatCard({
	title,
	value,
	description,
	trend,
	icon: Icon,
	color,
	bg,
	border,
}: StatCardProps) {
	return (
		<Card
			className={`relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${border}`}>
			<div
				className={`absolute top-0 right-0 p-3 opacity-10 ${color} rounded-bl-full`}>
				<Icon className="h-16 w-16" />
			</div>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="z-10 relative">
				<div className="text-3xl font-bold mb-1">{value}</div>
				<div className="flex items-center text-xs">
					{trend === "up" ? (
						<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
					) : (
						<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
					)}
					<span
						className={
							trend === "up"
								? "text-green-500 font-medium"
								: "text-muted-foreground"
						}>
						{description}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
