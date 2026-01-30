import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function ProfileSettingsTab() {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Settings</h2>

			<div className="space-y-4">
				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Change Password</h3>
								<p className="text-sm text-muted-foreground">
									Update your account password
								</p>
							</div>
							<Button variant="outline">Update</Button>
						</div>
					</CardContent>
				</Card>
		
				<Card>
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium">Notification Preferences</h3>
								<p className="text-sm text-muted-foreground">
									Manage email and push notifications
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
								<h3 className="font-medium">Two-Factor Authentication</h3>
								<p className="text-sm text-muted-foreground">
									Add an extra layer of security
								</p>
							</div>
							<Button variant="outline">Enable</Button>
						</div>
					</CardContent>
				</Card>

				<Card className="border-destructive/20">
					<CardContent className="">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium text-destructive">Deactivate Account</h3>
								<p className="text-sm text-muted-foreground">
									Temporarily disable your EPP access
								</p>
							</div>
							<Button
								variant="outline"
								className="text-destructive hover:text-destructive">
								Deactivate
							</Button>
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
