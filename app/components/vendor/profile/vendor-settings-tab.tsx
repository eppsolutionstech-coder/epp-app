import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function VendorSettingsTab() {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Settings</h2>

			<div className="space-y-4">
				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Company Information</h3>
								<p className="text-sm text-muted-foreground">
									Update your company details
								</p>
							</div>
							<Button variant="outline">Edit</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Payment Settings</h3>
								<p className="text-sm text-muted-foreground">
									Manage payment and payout preferences
								</p>
							</div>
							<Button variant="outline">Manage</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Notification Preferences</h3>
								<p className="text-sm text-muted-foreground">
									Configure order and update notifications
								</p>
							</div>
							<Button variant="outline">Configure</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">API Access</h3>
								<p className="text-sm text-muted-foreground">
									Manage API keys and integrations
								</p>
							</div>
							<Button variant="outline">View</Button>
						</div>
					</CardContent>
				</Card>

				{/* Sign Out */}
				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<LogOut className="h-5 w-5 text-muted-foreground" />
								<div>
									<h3 className="font-medium">Sign Out</h3>
									<p className="text-sm text-muted-foreground">
										Log out of your account
									</p>
								</div>
							</div>
							<Button variant="outline" asChild>
								<a href="/">Sign Out</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
