import { Outlet } from "react-router";
import { EmployeeHeader } from "@/components/employee/employee-header";

export default function EmployeeLayout() {
	return (
		<div className="flex flex-col h-screen overflow-hidden bg-muted/60 dark:bg-muted/10">
			<EmployeeHeader />

			{/* Main Content */}
			<main className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-[1600px] mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
