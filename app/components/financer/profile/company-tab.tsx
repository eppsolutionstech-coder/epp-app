import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Save } from "lucide-react";

export function FinancerCompanyTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Building className="h-5 w-5" />
					Company Information
				</CardTitle>
				<CardDescription>Your financing company details.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="companyName">Company Name</Label>
						<Input id="companyName" defaultValue="QuickFinance Corp" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="registrationNo">Registration Number</Label>
						<Input id="registrationNo" defaultValue="FIN-2024-001234" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="companyEmail">Company Email</Label>
						<Input
							id="companyEmail"
							type="email"
							defaultValue="info@quickfinance.com"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="companyPhone">Company Phone</Label>
						<Input id="companyPhone" defaultValue="+63 2 8888 1234" />
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							defaultValue="123 Finance Tower, Makati City, Metro Manila"
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Button className="bg-emerald-600 hover:bg-emerald-700">
						<Save className="h-4 w-4 mr-2" />
						Save Changes
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
