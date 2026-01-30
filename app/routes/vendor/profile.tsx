import { useParams, useNavigate } from "react-router";
import { Store, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_VENDORS, MOCK_PRODUCTS } from "~/data/mock-admin-data";
import { VendorAboutTab } from "~/components/vendor/profile/vendor-about-tab";
import { VendorAnalyticsTab } from "~/components/vendor/profile/vendor-analytics-tab";
import { VendorSettingsTab } from "~/components/vendor/profile/vendor-settings-tab";

const tabs = [
	{ id: "about", label: "Profile", icon: Store },
	{ id: "analytics", label: "Analytics", icon: BarChart3 },
	{ id: "settings", label: "Settings", icon: Settings },
];

const validTabs = tabs.map((t) => t.id);

export default function VendorProfile() {
	const { tab } = useParams();
	const navigate = useNavigate();
	const currentVendor = MOCK_VENDORS[0];
	const products = MOCK_PRODUCTS.filter((p) => p.vendorId === currentVendor.id);

	// Default to "about" if no tab or invalid tab
	const activeTab = tab && validTabs.includes(tab) ? tab : "about";

	const handleTabChange = (tabId: string) => {
		navigate(`/vendor/profile/${tabId}`);
	};

	return (
		<div className="space-y-6">
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
						<VendorAboutTab vendor={currentVendor} products={products} />
					)}

					{activeTab === "analytics" && <VendorAnalyticsTab products={products} />}

					{activeTab === "settings" && <VendorSettingsTab />}
				</div>
			</div>
		</div>
	);
}
