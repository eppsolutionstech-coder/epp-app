import { useParams, useNavigate } from "react-router";
import { User, Building, Bell, Shield, CreditCard, Percent, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancerProfileTab } from "@/components/financer/profile/profile-tab";
import { FinancerLoanSettingsTab } from "@/components/financer/profile/loan-settings-tab";
import { FinancerNotificationsTab } from "@/components/financer/profile/notifications-tab";
import { FinancerSecurityTab } from "@/components/financer/profile/security-tab";
import { FinancerBillingTab } from "@/components/financer/profile/billing-tab";
import { FinancerOrganizationsTab } from "@/components/financer/profile/organizations-tab";

const tabs = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "organizations", label: "Organizations", icon: Building2 },
	{ id: "loan-settings", label: "Loan Settings", icon: Percent },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "security", label: "Security", icon: Shield },
	{ id: "billing", label: "Billing", icon: CreditCard },
];

const validTabs = tabs.map((t) => t.id);

export default function FinancerProfile() {
	const { tab } = useParams();
	const navigate = useNavigate();

	const activeTab = tab && validTabs.includes(tab) ? tab : "profile";

	const handleTabChange = (tabId: string) => {
		navigate(`/financer/profile/${tabId}`);
	};

	return (
		<div className="space-y-6">
			{/* Page Title */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			{/* Two Column Layout */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Left - Tab Navigation */}
				<div className="w-full md:w-64 shrink-0">
					<nav className="space-y-1">
						{tabs.map((tabItem) => {
							const Icon = tabItem.icon;
							const isActive = activeTab === tabItem.id;

							return (
								<button
									key={tabItem.id}
									onClick={() => handleTabChange(tabItem.id)}
									className={cn(
										"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
										isActive
											? "bg-emerald-50 text-emerald-700 font-medium"
											: "hover:bg-muted/50 text-muted-foreground",
									)}>
									<div
										className={cn(
											"h-8 w-8 rounded-full flex items-center justify-center",
											isActive
												? "bg-emerald-600 text-white"
												: "bg-muted-foreground/10",
										)}>
										<Icon className="h-4 w-4" />
									</div>
									{tabItem.label}
								</button>
							);
						})}
					</nav>
				</div>

				{/* Right - Content */}
				<div className="flex-1 min-w-0">
					{activeTab === "profile" && <FinancerProfileTab />}
					{activeTab === "organizations" && <FinancerOrganizationsTab />}
					{activeTab === "loan-settings" && <FinancerLoanSettingsTab />}
					{activeTab === "notifications" && <FinancerNotificationsTab />}
					{activeTab === "security" && <FinancerSecurityTab />}
					{activeTab === "billing" && <FinancerBillingTab />}
				</div>
			</div>
		</div>
	);
}
