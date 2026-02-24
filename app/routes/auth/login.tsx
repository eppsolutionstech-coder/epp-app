import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { PAGE_TITLES } from "~/config/page-titles";
import type { Route } from "./+types/login";
import { useAuth } from "~/hooks/use-auth";
import { cn } from "@/lib/utils";

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
		id: "financier",
		title: "Financier",
		route: "/financier",
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
	const { login, error, clearError } = useAuth();

	const handleRoleChange = (roleId: string) => {
		const newRoleId = selectedRoleId === roleId ? "" : roleId;
		setSelectedRoleId(newRoleId);
		if (error) clearError();
		const role = roleOptions.find((r) => r.id === newRoleId);
		if (role) {
			setEmail(role.email);
			setPassword(role.password);
		} else {
			setEmail("");
			setPassword("");
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
		<div className="h-screen overflow-hidden flex">
			{/* Left Panel — 1/3 */}
			<div className="w-full lg:w-1/2 relative flex items-center justify-center px-8 lg:px-12 bg-background overflow-hidden">
				<div className="relative w-full max-w-sm space-y-10">
					{/* Logo */}
					<div className="flex items-center gap-2.5">
						<div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
							<span className="text-[9px] font-bold text-primary-foreground leading-none">
								EPP
							</span>
						</div>
						<span className="text-sm font-medium text-muted-foreground tracking-wide">
							Employee Purchase Program
						</span>
					</div>

					{/* Heading */}
					<div className="space-y-1">
						<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
						<p className="text-sm text-muted-foreground">
							Sign in to your account to continue.
						</p>
					</div>

					{/* Role chips */}
					<div className="space-y-3">
						<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
							Quick login as
						</p>
						<div className="flex flex-wrap gap-2">
							{roleOptions.map((role) => (
								<button
									key={role.id}
									type="button"
									onClick={() => handleRoleChange(role.id)}
									className={cn(
										"px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer",
										selectedRoleId === role.id
											? "bg-primary text-primary-foreground border-primary"
											: "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
									)}>
									{role.title}
								</button>
							))}
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-xs font-medium">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => {
									if (error) clearError();
									setEmail(e.target.value);
								}}
								aria-invalid={!!error}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-xs font-medium">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) => {
										if (error) clearError();
										setPassword(e.target.value);
									}}
									className="pr-10"
									aria-invalid={!!error}
									required
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									onClick={() => setShowPassword(!showPassword)}
									tabIndex={-1}>
									{showPassword ? (
										<EyeOff className="h-3.5 w-3.5" />
									) : (
										<Eye className="h-3.5 w-3.5" />
									)}
								</button>
							</div>
						</div>

						{error ? (
							<p className="text-xs text-destructive" role="alert" aria-live="polite">
								{error}
							</p>
						) : null}

						<Button
							type="submit"
							className="w-full mt-2"
							disabled={isLoading || !email || !password}>
							{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<p className="text-xs text-muted-foreground/60 text-center">
						Demo app — select a role above to prefill credentials.
					</p>
				</div>
			</div>

			{/* Right Panel — 2/3 */}
			<div
				className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-end p-16"
				style={{ background: "oklch(0.15 0.05 255)" }}>
				{/* Dot grid overlay */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage:
							"radial-gradient(circle, oklch(1 0 0 / 6%) 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>

				{/* Blobs */}
				<div
					className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-20"
					style={{
						background: "oklch(0.65 0.13 245)",
						filter: "blur(80px)",
						animation: "blob-float 9s ease-in-out infinite",
					}}
				/>
				<div
					className="absolute top-1/3 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-20"
					style={{
						background: "oklch(0.7 0.12 220)",
						filter: "blur(72px)",
						animation: "blob-drift 13s ease-in-out infinite",
						animationDelay: "4s",
					}}
				/>
				<div
					className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-20"
					style={{
						background: "oklch(0.75 0.1 280)",
						filter: "blur(72px)",
						animation: "blob-wander 16s ease-in-out infinite",
						animationDelay: "2s",
					}}
				/>
				<div
					className="absolute w-56 h-56 rounded-full pointer-events-none opacity-20"
					style={{
						background: "oklch(0.75 0.12 180)",
						filter: "blur(56px)",
						animation: "blob-pulse 10s ease-in-out infinite",
						animationDelay: "6s",
						top: "calc(50% - 7rem)",
						left: "calc(50% - 7rem)",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 space-y-4 text-white max-w-sm">
					<p className="text-[11px] font-medium uppercase tracking-widest text-white/40">
						Employee Purchase Program
					</p>
					<h2 className="text-3xl font-bold leading-snug">
						Streamline
						<br />
						Employee Purchases
					</h2>
					<p className="text-sm text-white/50 leading-relaxed">
						Quality products through convenient installment plans, all managed through
						one unified platform.
					</p>
					<div className="flex gap-8 pt-6 border-t border-white/10">
						<div>
							<div className="text-2xl font-bold">500+</div>
							<div className="text-xs text-white/40 mt-0.5">Products</div>
						</div>
						<div>
							<div className="text-2xl font-bold">50+</div>
							<div className="text-xs text-white/40 mt-0.5">Suppliers</div>
						</div>
						<div>
							<div className="text-2xl font-bold">1,000+</div>
							<div className="text-xs text-white/40 mt-0.5">Employees</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
