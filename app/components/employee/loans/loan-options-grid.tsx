import {
	ArrowRight,
	GraduationCap,
	Home,
	Car,
	HeartPulse,
	Banknote,
	Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const loanOptions = [
	{
		id: "emergency",
		title: "Emergency Loan",
		description: "Instant cash for urgent needs. Approval in minutes.",
		icon: HeartPulse,
		image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop",
		badge: "Popular",
	},
	{
		id: "salary",
		title: "Salary Advance",
		description: "Short-term cash advance against your next paycheck.",
		icon: Banknote,
		image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: "personal",
		title: "Personal Loan",
		description: "Flexible financing for any purpose up to ₱500,000.",
		icon: Briefcase,
		image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: "education",
		title: "Education Loan",
		description: "Invest in your future. Tuition assistance and more.",
		icon: GraduationCap,
		image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
		badge: "Low Interest",
	},
	{
		id: "home",
		title: "Home Improvement",
		description: "Funds for renovations, repairs, and upgrades.",
		icon: Home,
		image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
	},
	{
		id: "auto",
		title: "Auto Loan",
		description: "Get moving with affordable car financing options.",
		icon: Car,
		image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
	},
];

export function LoanOptionsGrid() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-bold tracking-tight">Available Loan Options</h2>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{loanOptions.map((loan) => (
					<Card
						key={loan.id}
						className="group cursor-pointer hover:shadow-xl transition-all border-none relative overflow-hidden h-[280px]">
						{/* Background Image */}
						<div className="absolute inset-0">
							<img
								src={loan.image}
								alt={loan.title}
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						</div>

						<CardContent className="relative z-10 px-6 h-full flex flex-col justify-between text-white">
							<div className="flex justify-between items-start">
								<div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
									<loan.icon className="h-6 w-6 text-white" />
								</div>
								{loan.badge && (
									<Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
										{loan.badge}
									</Badge>
								)}
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<h3 className="font-bold text-2xl tracking-tight leading-none">
										{loan.title}
									</h3>
									<p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
										{loan.description}
									</p>
								</div>

								<div className="flex items-center text-sm font-medium text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
									View Details <ArrowRight className="ml-2 h-4 w-4" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
