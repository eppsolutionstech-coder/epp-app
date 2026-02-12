import { Outlet } from "react-router";
import { FinancerHeader } from "@/components/financer/financer-header";

export default function FinancerLayout() {
	return (
		<div className="flex flex-col h-screen overflow-hidden bg-muted/40 dark:bg-muted/10">
			<FinancerHeader />

			{/* Main Content */}
			<main className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-8xl mx-auto px-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
