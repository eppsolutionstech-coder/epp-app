import { FileText, CheckCircle2, Wallet, RefreshCw } from "lucide-react";

const steps = [
	{
		id: 1,
		title: "Apply Online",
		description: "Select your loan type and fill out the quick request form.",
		icon: FileText,
	},
	{
		id: 2,
		title: "Quick Approval",
		description: "Our system reviews your request instantly based on credit limit.",
		icon: CheckCircle2,
	},
	{
		id: 3,
		title: "Disbursement",
		description: "Funds are credited directly to your payroll account.",
		icon: Wallet,
	},
	{
		id: 4,
		title: "Auto-Repayment",
		description: "Hassle-free payments automatically deducted from salary.",
		icon: RefreshCw,
	},
];

export function ApplicationSteps() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold tracking-tight">How it Works</h2>
			</div>

			<section className="relative w-full overflow-hidden rounded-2xl group">
				{/* Background Image */}
				<div className="absolute inset-0">
					<img
						src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
						alt="Dark Financial Background"
						className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
					/>
					{/* Dark Overlays like CatalogHero */}
					<div className="absolute inset-0 bg-black/60" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
				</div>

				<div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{steps.map((step, index) => (
							<div key={step.id} className="relative">
								{/* Connector Line (Desktop) */}
								{index < steps.length - 1 && (
									<div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-white/20 z-0" />
								)}

								<div className="group/card relative p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm h-full">
									<div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white group-hover/card:scale-110 transition-transform">
										<step.icon className="h-6 w-6" />
									</div>

									<div className="space-y-2">
										<p className="text-xs font-medium text-white/50 uppercase tracking-widest">
											Step 0{step.id}
										</p>
										<h3 className="text-lg font-semibold text-white">
											{step.title}
										</h3>
										<p className="text-sm text-white/70 font-light leading-relaxed">
											{step.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
