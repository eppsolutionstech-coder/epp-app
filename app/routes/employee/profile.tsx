import { useParams, useNavigate } from "react-router";
import { User, ShoppingBag, CreditCard, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_EMPLOYEES, MOCK_EMPLOYEE_PURCHASES } from "~/data/mock-admin-data";
import { ProfileAboutTab } from "~/components/employee/profile/profile-about-tab";
import { ProfileOrdersTab } from "~/components/employee/profile/profile-orders-tab";
import { ProfileCreditTab } from "~/components/employee/profile/profile-credit-tab";
import { ProfileSettingsTab } from "~/components/employee/profile/profile-settings-tab";

const tabs = [
	{ id: "about", label: "About me", icon: User },
	{ id: "orders", label: "My Orders", icon: ShoppingBag },
	{ id: "credit", label: "EPP Credit", icon: CreditCard },
	{ id: "settings", label: "Settings", icon: Settings },
];

const validTabs = tabs.map((t) => t.id);

export default function EmployeeProfile() {
	const { tab } = useParams();
	const navigate = useNavigate();
	const currentEmployee = MOCK_EMPLOYEES[0];
	const purchases = MOCK_EMPLOYEE_PURCHASES;
	const availableCredit = currentEmployee.creditLimit - currentEmployee.usedAmount;

	// Default to "about" if no tab or invalid tab
	const activeTab = tab && validTabs.includes(tab) ? tab : "about";

	const handleTabChange = (tabId: string) => {
		navigate(`/employee/profile/${tabId}`);
	};

	return (
		<div className="space-y-6 max-w-6xl mx-auto">
			{/* Page Title */}
			<h1 className="text-3xl font-bold tracking-tight">Profile</h1>

			{/* Two Column Layout */}
			<div className="flex gap-12">
				{/* Left - Tab Navigation */}
				<div className="w-64 shrink-0">
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
											? "bg-muted font-medium"
											: "hover:bg-muted/50 text-muted-foreground",
									)}>
									<div
										className={cn(
											"h-8 w-8 rounded-full flex items-center justify-center",
											isActive
												? "bg-primary text-primary-foreground"
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
					{activeTab === "about" && (
						<ProfileAboutTab
							employee={currentEmployee}
							purchases={purchases}
							availableCredit={availableCredit}
						/>
					)}

					{activeTab === "orders" && <ProfileOrdersTab />}

					{activeTab === "credit" && (
						<ProfileCreditTab
							employee={currentEmployee}
							purchases={purchases}
							availableCredit={availableCredit}
						/>
					)}

					{activeTab === "settings" && <ProfileSettingsTab />}
				</div>
			</div>
		</div>
	);
}
