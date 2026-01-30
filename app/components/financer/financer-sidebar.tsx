import { NavLink } from "react-router";
import {
	LayoutDashboard,
	FileText,
	Wallet,
	CreditCard,
	Users,
	PieChart,
	Settings,
	LogOut,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FinancerSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const navItems = [
	{ href: "/financer", icon: LayoutDashboard, label: "Dashboard", end: true },
	{ href: "/financer/applications", icon: FileText, label: "Applications" },
	{ href: "/financer/loans", icon: Wallet, label: "Active Loans" },
	{ href: "/financer/payments", icon: CreditCard, label: "Payments" },
	{ href: "/financer/reports", icon: PieChart, label: "Reports" },
	{ href: "/financer/profile", icon: Settings, label: "Settings" },
];

export function FinancerSidebar({ isOpen, onClose }: FinancerSidebarProps) {
	return (
		<>
			{/* Mobile Sidebar Overlay */}
			<div
				className={cn(
					"fixed inset-0 z-40 bg-black/50 lg:hidden",
					isOpen ? "block" : "hidden",
				)}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 ease-in-out h-screen flex flex-col",
					"lg:static lg:translate-x-0",
					isOpen
						? "w-64 translate-x-0"
						: "w-64 -translate-x-full lg:w-0 lg:overflow-hidden lg:border-r-0",
				)}>
				{/* Sidebar Header - Fixed */}
				<div className="flex h-16 items-center border-b px-6 min-w-[16rem] shrink-0">
					<div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
						<div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
							<Wallet className="h-5 w-5" />
						</div>
						<span>Financer</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="ml-auto lg:hidden"
						onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Nav Items - Scrollable */}
				<div className="flex-1 overflow-y-auto p-4 min-w-[16rem]">
					<div className="flex flex-col gap-1">
						{navItems.map((item) => (
							<NavLink
								key={item.href}
								to={item.href}
								end={item.end}
								className={({ isActive }) =>
									cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive
											? "bg-emerald-500 text-white"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)
								}>
								<item.icon className="h-4 w-4" />
								{item.label}
							</NavLink>
						))}
					</div>
				</div>

				{/* Sidebar Footer - Fixed */}
				<div className="p-4 border-t min-w-[16rem] shrink-0">
					<Button
						variant="outline"
						className="w-full justify-start gap-3 border-0 bg-gray-100"
						asChild>
						<a href="/">
							<LogOut className="h-4 w-4" />
							Sign Out
						</a>
					</Button>
				</div>
			</aside>
		</>
	);
}
