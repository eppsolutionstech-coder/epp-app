import { NavLink, useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import {
	LayoutDashboard,
	Users,
	FileCheck,
	PieChart,
	Settings,
	LogOut,
	X,
	Package,
	Store,
	ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const navItems = [
	{ href: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
	{ href: "/admin/organizations", icon: Users, label: "Organizations" },
	{ href: "/admin/orders", icon: ShoppingCart, label: "Orders", count: 12 },
	{ href: "/admin/products", icon: Package, label: "Products", count: 5 },
	{ href: "/admin/suppliers", icon: Store, label: "suppliers" },
	{ href: "/admin/employees", icon: Users, label: "Employees" },
	{ href: "/admin/reports", icon: PieChart, label: "Reports" },
	{ href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
	const navigate = useNavigate();
	const { logout } = useAuth();

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
					<div className="flex items-center gap-2 font-bold text-xl text-primary">
						<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
							A
						</div>
						<span>Admin</span>
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
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground",
									)
								}>
								<item.icon className="h-4 w-4" />
								<span className="flex-1">{item.label}</span>
								{item.count && (
									<span
										className={cn(
											"flex h-5 w-5 items-center justify-center rounded-full text-xs",
											"bg-primary/20 text-primary dark:bg-primary/30",
										)}>
										{item.count}
									</span>
								)}
							</NavLink>
						))}
					</div>
				</div>

				{/* Sidebar Footer - Fixed */}
				<div className="p-4 border-t min-w-[16rem] shrink-0">
					<Button
						variant="outline"
						className="w-full justify-start gap-3 border-0 bg-gray-100"
						onClick={async () => {
							await logout();
							navigate("/login");
						}}>
						<LogOut className="h-4 w-4" />
						Sign Out
					</Button>
				</div>
			</aside>
		</>
	);
}

