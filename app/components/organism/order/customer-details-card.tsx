import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Building } from "lucide-react";

interface CustomerDetailsCardProps {
	user: any; // Using any to match parent
}

export function CustomerDetailsCard({ user }: CustomerDetailsCardProps) {
	const getEmployeeName = () => {
		if (user?.firstName && user?.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		return user?.username || "Unknown Customer";
	};

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50 flex flex-col">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
					<User className="h-4 w-4" />
					Customer Details
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 space-y-4">
				<div className="flex items-center gap-4">
					<div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner uppercase">
						{getEmployeeName().charAt(0)}
					</div>
					<div>
						<p className="font-bold text-foreground">{getEmployeeName()}</p>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
							<Mail className="h-3 w-3" />
							{user?.email || "No email"}
						</div>
					</div>
				</div>
				<Separator className="bg-border/50" />
				<div className="flex justify-between items-center text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Building className="h-3.5 w-3.5" />
						<span>Company</span>
					</div>
					<span className="font-medium">TechCorp Inc.</span>
				</div>
			</CardContent>
			<CardFooter className="pt-0 pb-4">
				<Button variant="secondary" size="sm" className="w-full text-xs h-8">
					View Profile
				</Button>
			</CardFooter>
		</Card>
	);
}
