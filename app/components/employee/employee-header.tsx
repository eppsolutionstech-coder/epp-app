import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Bell, User, ShoppingCart, ShoppingBag, CreditCard, Settings, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCartItems } from "~/hooks/use-cart-item";
import { useAuth } from "~/hooks/use-auth";

// Mock employee data
const currentEmployee = {
	firstName: "Alice",
	lastName: "Johnson",
};

export function EmployeeHeader() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const initials = `${currentEmployee.firstName[0]}${currentEmployee.lastName[0]}`;
	const {
		data: cartItemsCount,
		isLoading,
		isError,
	} = useGetCartItems({
		// fields: "id, employeeId, product.id, product.sku, product.name, product.srp, product.employeePrice, product.stockQuantity, product.images, quantity, createdAt, updatedAt",
		limit: 100,
		count: true,
		document: false,
		pagination: false,
	});

	return (
		<header className="sticky top-0 z-30 h-16 bg-white">
			<div className="max-w-7xl mx-auto h-full flex items-center gap-2 px-6">
				{/* Logo/Brand */}
				<div
					onClick={() => navigate("/employee")}
					className="flex items-center gap-2 font-bold text-xl text-primary shrink-0 cursor-pointer">
					<div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
						<User className="h-4 w-4" />
					</div>
					<span>EPP</span>
				</div>

				{/* Navigation Items - Centered
				<nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
					{navItems.map((item) => (
						<NavLink
							key={item.href}
							to={item.href}
							end={item.end}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)
							}>
							<item.icon className="h-4 w-4" />
							{item.label}
						</NavLink>
					))}
				</nav> */}

				<div className="flex-1" />

				{/* Notifications */}
				{/* <Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					<span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full" />
				</Button> */}

				{/* Cart */}
				<Button variant="ghost" size="icon" className="relative" asChild>
					<Link to="/employee/cart">
						<ShoppingCart className="h-5 w-5" />
						{isLoading ? (
							<span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-muted text-[10px] text-muted-foreground rounded-full flex items-center justify-center animate-pulse">
								•
							</span>
						) : (cartItemsCount?.count ?? 0) > 0 && !isError ? (
							<span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center">
								{cartItemsCount?.count}
							</span>
						) : null}
					</Link>
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
								{currentEmployee.firstName} {currentEmployee.lastName}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/employee/profile/about" className="cursor-pointer">
								<User className="mr-2 h-4 w-4" />
								<span>About me</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/employee/profile/orders" className="cursor-pointer">
								<ShoppingBag className="mr-2 h-4 w-4" />
								<span>My Orders</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/employee/profile/credit" className="cursor-pointer">
								<CreditCard className="mr-2 h-4 w-4" />
								<span>EPP Credit</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/employee/profile/settings" className="cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () => {
								await logout();
								navigate("/login");
							}}
							className="text-red-600 focus:text-red-600 cursor-pointer">
							<LogOut className="mr-2 h-4 w-4" />
							<span>Sign out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
