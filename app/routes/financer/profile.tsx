import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	User,
	Building,
	Mail,
	Phone,
	MapPin,
	Bell,
	Shield,
	CreditCard,
	Save,
} from "lucide-react";

export default function FinancerProfile() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="company">Company</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
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
									<Button variant="outline" size="sm">Change Photo</Button>
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
				</TabsContent>

				<TabsContent value="company">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building className="h-5 w-5" />
								Company Information
							</CardTitle>
							<CardDescription>
								Your financing company details.
							</CardDescription>
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
									<Input id="companyEmail" type="email" defaultValue="info@quickfinance.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="companyPhone">Company Phone</Label>
									<Input id="companyPhone" defaultValue="+63 2 8888 1234" />
								</div>
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="address">Address</Label>
									<Input id="address" defaultValue="123 Finance Tower, Makati City, Metro Manila" />
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
				</TabsContent>

				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bell className="h-5 w-5" />
								Notification Preferences
							</CardTitle>
							<CardDescription>
								Configure how and when you receive notifications.
							</CardDescription>
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
				</TabsContent>

				<TabsContent value="security">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Security Settings
							</CardTitle>
							<CardDescription>
								Manage your account security and authentication.
							</CardDescription>
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
				</TabsContent>

				<TabsContent value="billing">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Billing Information
							</CardTitle>
							<CardDescription>
								Manage your billing details and payment methods.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="p-4 bg-emerald-50 rounded-lg">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium text-emerald-700">Enterprise Plan</p>
										<p className="text-sm text-emerald-600">
											Unlimited loans, advanced reporting, priority support
										</p>
									</div>
									<Button variant="outline">Change Plan</Button>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="font-medium mb-4">Payment Method</h4>
								<div className="flex items-center gap-4 p-4 border rounded-lg">
									<div className="h-10 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
										VISA
									</div>
									<div className="flex-1">
										<p className="font-medium">**** **** **** 4242</p>
										<p className="text-sm text-muted-foreground">Expires 12/2025</p>
									</div>
									<Button variant="ghost" size="sm">Edit</Button>
								</div>
							</div>

							<Separator />

							<div>
								<h4 className="font-medium mb-4">Billing History</h4>
								<div className="space-y-2">
									{[
										{ date: "Jun 1, 2024", amount: "$299.00", status: "Paid" },
										{ date: "May 1, 2024", amount: "$299.00", status: "Paid" },
										{ date: "Apr 1, 2024", amount: "$299.00", status: "Paid" },
									].map((invoice, i) => (
										<div key={i} className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<p className="font-medium">{invoice.date}</p>
												<p className="text-sm text-muted-foreground">Enterprise Plan</p>
											</div>
											<div className="text-right">
												<p className="font-medium">{invoice.amount}</p>
												<p className="text-sm text-green-600">{invoice.status}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
