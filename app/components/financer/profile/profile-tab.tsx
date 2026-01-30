import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Save } from "lucide-react";

export function FinancerProfileTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Personal Information
				</CardTitle>
				<CardDescription>
					Update your personal details and contact information.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-center gap-6">
					<div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
						<User className="h-10 w-10 text-emerald-600" />
					</div>
					<div>
						<Button variant="outline" size="sm">
							Change Photo
						</Button>
						<p className="text-xs text-muted-foreground mt-1">
							JPG, PNG or GIF. Max size 2MB.
						</p>
					</div>
				</div>

				<Separator />

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input id="firstName" defaultValue="John" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input id="lastName" defaultValue="Finance" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue="john@financecompany.com" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<Input id="phone" defaultValue="+63 917 123 4567" />
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
