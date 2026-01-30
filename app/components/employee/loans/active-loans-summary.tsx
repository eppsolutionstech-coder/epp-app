import { ArrowRight, Calendar, CreditCard, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ActiveLoansSummary() {
	// Mock data for active loan
	const hasActiveLoan = true;

	if (!hasActiveLoan) {
		return null; // Or a smaller placeholder
	}

	return (
		<div className="relative w-full overflow-hidden rounded-2xl group text-white">
			{/* Background Image */}
			<div className="absolute inset-0">
				<img
					src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=2070&auto=format&fit=crop"
					alt="Active Loan Background"
					className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
				/>
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
				<div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
			</div>

			<CardContent className="relative z-10 p-8 md:p-10 space-y-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-sm border border-emerald-500/30">
							<CreditCard className="h-6 w-6 text-emerald-400" />
						</div>
						<div>
							<h2 className="text-2xl font-bold tracking-tight">
								Emergency Fund Loan
							</h2>
							<p className="text-sm text-emerald-200/80 font-mono">
								ID: #LN-2024-001 • Active
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all">
						View Loan Details <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-4 border-t border-white/10 border-b">
					<div>
						<p className="text-sm font-medium text-slate-300 mb-2">
							Outstanding Balance
						</p>
						<p className="text-4xl font-light tracking-tight">
							₱8,450<span className="text-lg text-slate-400">.00</span>
						</p>
						<p className="text-xs text-slate-400 mt-1">Total Principal: ₱10,000.00</p>
					</div>
					<div>
						<p className="text-sm font-medium text-slate-300 mb-2">
							Next Scheduled Payment
						</p>
						<div className="flex items-baseline gap-2">
							<p className="text-3xl font-semibold text-white">
								₱1,450<span className="text-sm text-slate-400">.00</span>
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs text-amber-300 mt-2 px-2 py-1 bg-amber-500/10 rounded-md w-fit border border-amber-500/20">
							<Calendar className="h-3 w-3" />
							<span>Due Feb 15, 2024</span>
						</div>
					</div>
					<div className="flex flex-col justify-center space-y-3">
						<div className="flex justify-between items-end">
							<div>
								<p className="text-sm font-medium text-slate-300">
									Repayment Status
								</p>
								<p className="text-xs text-slate-400 mt-1">
									1 of 6 payments completed
								</p>
							</div>
							<span className="text-xl font-bold text-emerald-400">15%</span>
						</div>
						<Progress value={15} className="h-2 bg-slate-700" />{" "}
						{/* Need to ensure Progress component supports className for custom coloring if needed, usually css vars */}
					</div>
				</div>

				<div className="flex items-center gap-2 text-xs text-slate-400">
					<TrendingDown className="h-4 w-4 text-emerald-400" />
					<span>
						Your next deduction will be automatically processed from your payroll. No
						action needed.
					</span>
				</div>
			</CardContent>
		</div>
	);
}
