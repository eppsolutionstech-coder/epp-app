import { Outlet } from "react-router";
import { useState } from "react";
import { FinancerSidebar } from "@/components/financer/financer-sidebar";
import { FinancerHeader } from "@/components/financer/financer-header";

export default function FinancerLayout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="fixed inset-0 flex overflow-hidden bg-muted/40 dark:bg-muted/10">
			<FinancerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
				<FinancerHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
				<main className="flex-1 p-6 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
