import { Outlet } from "react-router";
import { VendorHeader } from "@/components/vendor/vendor-header";

export default function VendorLayout() {
	return (
		<div className="flex flex-col h-screen overflow-hidden bg-muted/40 dark:bg-muted/10">
			<VendorHeader />

			{/* Main Content */}
			<main className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-7xl mx-auto px-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
