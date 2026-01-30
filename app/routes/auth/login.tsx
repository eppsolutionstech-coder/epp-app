import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, Store, Shield, ArrowRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router";
import { PAGE_TITLES } from "~/config/page-titles";
import type { Route } from "./+types/login";
import { useAuth } from "~/hooks/use-auth";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.login }];
}

interface RoleOption {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	route: string;
	color: string;
	bgColor: string;
}

const roleOptions: RoleOption[] = [
	{
		id: "employee",
		title: "Login as Employee",
		description: "Browse and purchase products through the EPP program",
		icon: Users,
		route: "/employee/",
		color: "text-blue-600 dark:text-blue-400",
		bgColor:
			"bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800",
	},
	{
		id: "vendor",
		title: "Login as Vendor",
		description: "Manage your products and fulfill employee orders",
		icon: Store,
		route: "/vendor/dashboard",
		color: "text-emerald-600 dark:text-emerald-400",
		bgColor:
			"bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800",
	},
	{
		id: "admin",
		title: "Login as EPP Admin",
		description: "Manage vendors, products, and program oversight",
		icon: Shield,
		route: "/admin",
		color: "text-purple-600 dark:text-purple-400",
		bgColor:
			"bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800",
	},
	{
		id: "financer",
		title: "Login as Financer",
		description: "Manage loan applications, payments, and financing",
		icon: Wallet,
		route: "/financer",
		color: "text-teal-600 dark:text-teal-400",
		bgColor:
			"bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 border-teal-200 dark:border-teal-800",
	},
];

export default function LoginPage() {
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleRoleSelect = async (role: RoleOption) => {
		setSelectedRole(role.id);
		setIsLoading(true);

		try {
			// await login("epp-admin@gmail.com", "Test123!");
			navigate(role.route);
		} catch (err) {
			// Error is handled by the hook, but you can add additional handling here if needed
			console.error("Login failed:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-screen overflow-hidden flex flex-col lg:flex-row">
			{/* Left Panel - Role Selection */}
			<div className="flex-1 flex items-center justify-center py-12 px-6 lg:px-12 bg-gradient-to-br from-background via-background to-muted/30">
				<div className="w-full max-w-lg space-y-8">
					{/* Header */}
					<div className="text-center space-y-3">
						<div className="flex justify-center mb-6">
							<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
								<span className="text-2xl font-bold text-primary-foreground">
									EPP
								</span>
							</div>
						</div>
						<h1 className="text-3xl font-bold tracking-tight">
							Employee Purchase Program
						</h1>
						<p className="text-muted-foreground text-lg">
							Select your role to continue
						</p>
					</div>

					{/* Role Selection Cards */}
					<div className="space-y-4">
						{roleOptions.map((role) => {
							const Icon = role.icon;
							const isSelected = selectedRole === role.id;

							return (
								<Card
									key={role.id}
									className={`cursor-pointer transition-all duration-300 border-2 ${role.bgColor} ${
										isSelected ? "ring-2 ring-primary ring-offset-2" : ""
									}`}
									onClick={() => !isLoading && handleRoleSelect(role)}>
									<CardContent className="px-6">
										<div className="flex items-center gap-4">
											{/* Icon */}
											<div
												className={`h-14 w-14 rounded-xl flex items-center justify-center ${role.color} bg-white dark:bg-gray-900 shadow-sm`}>
												<Icon className="h-7 w-7" />
											</div>

											{/* Content */}
											<div className="flex-1">
												<h3 className="font-semibold text-lg">
													{role.title}
												</h3>
												<p className="text-sm text-muted-foreground mt-0.5">
													{role.description}
												</p>
											</div>

											{/* Arrow / Loading */}
											<div className="flex-shrink-0">
												{isSelected && isLoading ? (
													<Loader2 className="h-5 w-5 animate-spin text-primary" />
												) : (
													<ArrowRight className="h-5 w-5 text-muted-foreground" />
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Footer Note */}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							This is a <span className="font-medium">demo application</span> for UI
							demonstration purposes.
							<br />
							No authentication required.
						</p>
					</div>
				</div>
			</div>

			{/* Right Panel - Hero Image */}
			<div className="hidden lg:block lg:w-[45%] relative">
				<img
					src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2670"
					alt="Modern Office"
					className="h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/20 flex flex-col justify-end p-12">
					<div className="max-w-md space-y-4 text-white">
						<h2 className="text-2xl font-bold">Streamline Employee Purchases</h2>
						<p className="text-gray-300 leading-relaxed">
							Our Employee Purchase Program makes it easy for your team to access
							quality products through convenient installment plans, all managed
							through one unified platform.
						</p>
						<div className="flex gap-8 pt-4">
							<div>
								<div className="text-3xl font-bold">500+</div>
								<div className="text-sm text-gray-400">Products</div>
							</div>
							<div>
								<div className="text-3xl font-bold">50+</div>
								<div className="text-sm text-gray-400">Vendors</div>
							</div>
							<div>
								<div className="text-3xl font-bold">1000+</div>
								<div className="text-sm text-gray-400">Employees</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
