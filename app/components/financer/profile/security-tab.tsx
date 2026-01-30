import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Save } from "lucide-react";

export function FinancerSecurityTab() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Security Settings
				</CardTitle>
				<CardDescription>Manage your account security and authentication.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div>
						<h4 className="font-medium mb-2">Change Password</h4>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input id="currentPassword" type="password" />
							</div>
							<div />
							<div className="space-y-2">
								<Label htmlFor="newPassword">New Password</Label>
								<Input id="newPassword" type="password" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<Input id="confirmPassword" type="password" />
							</div>
						</div>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Two-Factor Authentication</p>
							<p className="text-sm text-muted-foreground">
								Add an extra layer of security to your account
							</p>
						</div>
						<Button variant="outline">Enable 2FA</Button>
					</div>

					<Separator />

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Active Sessions</p>
							<p className="text-sm text-muted-foreground">
								Manage your active login sessions
							</p>
						</div>
						<Button variant="outline">View Sessions</Button>
					</div>
				</div>

				<div className="flex justify-end">
					<Button className="bg-emerald-600 hover:bg-emerald-700">
						<Save className="h-4 w-4 mr-2" />
						Update Password
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
