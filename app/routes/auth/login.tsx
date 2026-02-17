import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
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
	route: string;
	email: string;
	password: string;
}

const roleOptions: RoleOption[] = [
	{
		id: "employee",
		title: "Employee",
		route: "/employee/",
		email: "ca-employee@gmail.com",
		password: "Test123!",
	},
	{
		id: "supplier",
		title: "Supplier",
		route: "/supplier/dashboard",
		email: "ca-supplier@gmail.com",
		password: "Test123!",
	},
	{
		id: "financer",
		title: "Financer",
		route: "/financer",
		email: "ca-financier@gmail.com",
		password: "Test123!",
	},
	{
		id: "admin",
		title: "EPP Admin",
		route: "/admin",
		email: "ca-admin@gmail.com",
		password: "Test123!",
	},
];

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [selectedRoleId, setSelectedRoleId] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleRoleChange = (roleId: string) => {
		setSelectedRoleId(roleId);
		const role = roleOptions.find((r) => r.id === roleId);
		if (role) {
			setEmail(role.email);
			setPassword(role.password);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) return;

		setIsLoading(true);
		const role = roleOptions.find((r) => r.id === selectedRoleId);

		try {
			await login(email, password);
			navigate(role?.route ?? "/employee/");
		} catch (err) {
			console.error("Login failed:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-screen overflow-hidden flex flex-col lg:flex-row">
			{/* Left Panel - Login Form */}
			<div className="flex-1 flex items-center justify-center py-12 px-6 lg:px-12 bg-gradient-to-br from-background via-background to-muted/30">
				<div className="w-full max-w-md space-y-8">
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
							Sign in to your account
						</p>
					</div>

					{/* Login Form */}
					<Card>
						<CardContent className="pt-6 space-y-6">
							{/* Quick Role Select */}
							<div className="space-y-2">
								<Label htmlFor="role-select">Quick Login As</Label>
								<Select
									value={selectedRoleId}
									onValueChange={handleRoleChange}>
									<SelectTrigger id="role-select">
										<SelectValue placeholder="Select a role to prefill..." />
									</SelectTrigger>
									<SelectContent>
										{roleOptions.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												{role.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2 text-muted-foreground">
										credentials
									</span>
								</div>
							</div>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="pr-10"
											required
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
											onClick={() => setShowPassword(!showPassword)}
											tabIndex={-1}>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={isLoading || !email || !password}>
									{isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
									) : (
										<LogIn className="h-4 w-4 mr-2" />
									)}
									{isLoading ? "Signing in..." : "Sign In"}
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Footer Note */}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							This is a <span className="font-medium">demo application</span>{" "}
							for UI demonstration purposes.
							<br />
							Use the dropdown above to quickly prefill credentials.
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
								<div className="text-sm text-gray-400">Suppliers</div>
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
