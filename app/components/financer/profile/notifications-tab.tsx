import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Save } from "lucide-react";

export function FinancerNotificationsTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bell className="h-5 w-5" />
					Notification Preferences
				</CardTitle>
				<CardDescription>Configure how and when you receive notifications.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">New Loan Applications</p>
							<p className="text-sm text-muted-foreground">
								Get notified when customers apply for loans
							</p>
						</div>
						<Switch defaultChecked />
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Payment Received</p>
							<p className="text-sm text-muted-foreground">
								Get notified when payments are received
							</p>
						</div>
						<Switch defaultChecked />
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Overdue Alerts</p>
							<p className="text-sm text-muted-foreground">
								Get notified when payments become overdue
							</p>
						</div>
						<Switch defaultChecked />
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Weekly Reports</p>
							<p className="text-sm text-muted-foreground">
								Receive weekly summary reports via email
							</p>
						</div>
						<Switch />
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Marketing Updates</p>
							<p className="text-sm text-muted-foreground">
								Receive updates about new features and promotions
							</p>
						</div>
						<Switch />
					</div>
				</div>

				<div className="flex justify-end">
					<Button className="bg-emerald-600 hover:bg-emerald-700">
						<Save className="h-4 w-4 mr-2" />
						Save Preferences
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
