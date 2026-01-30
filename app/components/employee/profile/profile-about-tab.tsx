import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Building2, Calendar } from "lucide-react";
import type { Employee, EmployeePurchase } from "~/data/mock-admin-data";

interface ProfileAboutTabProps {
	employee: Employee;
	purchases: EmployeePurchase[];
	availableCredit: number;
}

export function ProfileAboutTab({ employee, purchases, availableCredit }: ProfileAboutTabProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<h2 className="text-2xl font-semibold">About me</h2>
				<Button variant="outline" size="sm">
					Edit
				</Button>
			</div>

			{/* Profile Card */}
			<Card>
				<CardContent className="">
					<div className="flex items-start gap-6">
						{/* Avatar */}
						<div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shrink-0">
							<span className="text-2xl font-bold text-primary-foreground">
								{employee.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</span>
						</div>

						{/* Info */}
						<div className="space-y-4 flex-1">
							<div>
								<h3 className="text-xl font-semibold">{employee.name}</h3>
								<p className="text-muted-foreground">Employee</p>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<div className="flex items-center gap-2 text-sm">
									<Mail className="h-4 w-4 text-muted-foreground" />
									{employee.email}
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Building2 className="h-4 w-4 text-muted-foreground" />
									{employee.department}
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									Member since 2024
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Badge variant="default" className="capitalize">
										{employee.status}
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="text-center">
						<div className="text-3xl font-bold">{purchases.length}</div>
						<p className="text-sm text-muted-foreground">Total Orders</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="text-center">
						<div className="text-3xl font-bold">
							₱{employee.usedAmount.toLocaleString()}
						</div>
						<p className="text-sm text-muted-foreground">Total Spent</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="text-center">
						<div className="text-3xl font-bold">
							₱{availableCredit.toLocaleString()}
						</div>
						<p className="text-sm text-muted-foreground">Available Credit</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
