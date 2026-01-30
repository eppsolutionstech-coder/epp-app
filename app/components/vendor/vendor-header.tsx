import { NavLink, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Bell,
	Store,
	LayoutDashboard,
	Package,
	ShoppingCart,
	Settings,
	BarChart3,
	LogOut,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
	{ href: "/vendor/products", icon: Package, label: "Products" },
	{ href: "/vendor/orders", icon: ShoppingCart, label: "Orders" },
];

// Mock vendor data
const currentVendor = {
	name: "TechWorld Electronics",
};

export function VendorHeader() {
	const initials = currentVendor.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2);

	return (
		<header className="sticky top-0 z-30 h-16 border-b bg-card">
			<div className="max-w-7xl mx-auto h-full flex items-center gap-4 px-6">
				{/* Logo/Brand */}
				<div className="flex items-center gap-2 font-bold text-xl text-primary shrink-0">
					<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
						<Store className="h-4 w-4" />
					</div>
					<span>EPP</span>
				</div>

				{/* Navigation Items - Centered */}
				<nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
					{navItems.map((item) => (
						<NavLink
							key={item.href}
							to={item.href}
							end={item.end}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
									isActive
										? "bg-primary/10 text-primary shadow-sm"
										: "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
								)
							}>
							<item.icon className="h-4 w-4" />
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="flex-1" />

				{/* Notifications */}
				<Button variant="ghost" size="icon" className="relative rounded-full">
					<Bell className="h-5 w-5" />
					<span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full shadow-sm ring-1 ring-card" />
				</Button>

				{/* Profile Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="rounded-full gap-2 px-2 hover:bg-muted/50">
							<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm ring-1 ring-background">
								<span className="text-xs font-semibold text-primary-foreground">
									{initials}
								</span>
							</div>
							<span className="hidden sm:inline text-sm font-medium">
								{currentVendor.name}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/vendor/profile/about" className="cursor-pointer">
								<Store className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/vendor/profile/analytics" className="cursor-pointer">
								<BarChart3 className="mr-2 h-4 w-4" />
								<span>Analytics</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/vendor/profile/settings" className="cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							asChild
							className="text-red-600 focus:text-red-600 cursor-pointer">
							<Link to="/login">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Sign out</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
