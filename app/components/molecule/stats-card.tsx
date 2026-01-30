import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface StatsCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: LucideIcon;
	color: string;
	bgColor: string;
}

export function StatsCard({
	title,
	value,
	description,
	icon: Icon,
	color,
	bgColor,
}: StatsCardProps) {
	return (
		<Card className="bg-gradient-to-bl from-primary/30 via-white to-white">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className={`h-8 w-8 rounded-lg ${bgColor} flex items-center justify-center`}>
					<Icon className={`h-4 w-4 ${color}`} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
