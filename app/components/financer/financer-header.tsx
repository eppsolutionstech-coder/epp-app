import { NavLink, Link, useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
	Bell,
	Wallet,
	LayoutDashboard,
	FileText,
	PieChart,
	ReceiptText,
	BookOpen,
	Settings,
	LogOut,
	User,
	ChevronDown,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/financer", icon: LayoutDashboard, label: "Dashboard", end: true },
	{ href: "/financer/applications", icon: FileText, label: "Applications" },
	// { href: "/financer/loans", icon: Wallet, label: "Loans" },
	// { href: "/financer/payments", icon: CreditCard, label: "Payments" },
	// { href: "/financer/reports", icon: PieChart, label: "Reports" },
	// { href: "/financer/statements", icon: ReceiptText, label: "SOA" },
	{ href: "/financer/ledger", icon: BookOpen, label: "Ledger" },
];

// Mock financer data
const currentFinancer = {
	name: "Global Finance",
	role: "Admin",
};

export function FinancerHeader() {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const initials = currentFinancer.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
				{/* Logo */}
				<div className="flex items-center gap-2.5 mr-8 shrink-0">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 ring-1 ring-emerald-600/20">
						<Wallet className="h-5 w-5" />
					</div>
					<span className="font-bold text-lg tracking-tight bg-gradient-to-br from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
						Financer
					</span>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-1">
					{navItems.map((item) => (
						<NavLink
							key={item.href}
							to={item.href}
							end={item.end}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
									isActive
										? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)
							}>
							<item.icon className="h-4 w-4" />
							<span>{item.label}</span>
						</NavLink>
					))}
				</nav>

				<div className="flex-1" />

				{/* Right Actions */}
				<div className="flex items-center gap-3">
					{/* Notifications */}
					<Button
						variant="ghost"
						size="icon"
						className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
						<Bell className="h-4.5 w-4.5" />
						<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-background" />
					</Button>

					{/* Profile Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="pl-2 pr-1 h-10 rounded-full gap-2 hover:bg-muted/50 data-[state=open]:bg-muted/50 ml-1">
								<div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center ring-1 ring-black/5 dark:ring-white/10">
									<span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
										{initials}
									</span>
								</div>
								<div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
									<span className="text-sm font-medium">
										{currentFinancer.name}
									</span>
								</div>
								<ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 p-1" sideOffset={8}>
							<div className="flex items-center gap-3 p-3 pb-2">
								<div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
									<span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
										{initials}
									</span>
								</div>
								<div className="flex flex-col space-y-0.5">
									<p className="text-sm font-medium">{currentFinancer.name}</p>
									<p className="text-xs text-muted-foreground">
										{currentFinancer.role}
									</p>
								</div>
							</div>
							<DropdownMenuSeparator className="my-1" />
							<DropdownMenuItem asChild>
								<Link to="/financer/profile" className="cursor-pointer gap-2 p-2">
									<User className="h-4 w-4" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									to="/financer/profile/security"
									className="cursor-pointer gap-2 p-2">
									<Settings className="h-4 w-4" />
									<span>Settings</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="my-1" />
							<DropdownMenuItem
								onClick={async () => {
									await logout();
									navigate("/login");
								}}
								className="text-red-600 focus:text-red-600 cursor-pointer gap-2 p-2 focus:bg-red-50 dark:focus:bg-red-950/30">
								<LogOut className="h-4 w-4" />
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
