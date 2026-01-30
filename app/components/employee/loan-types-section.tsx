import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const loanTypes = [
	{
		id: "emergency",
		title: "Emergency",
		subtitle: "Quick Approval",
		description: "Instant funds for unexpected life events.",
	},
	{
		id: "salary",
		title: "Salary",
		subtitle: "Payroll Deduct",
		description: "Low rates, automatically paid from your salary.",
	},
	{
		id: "personal",
		title: "Personal",
		subtitle: "Flexible Term",
		description: "Finance your goals with custom repayment plans.",
	},
];

export function LoanTypesSection() {
	const navigate = useNavigate();

	return (
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

			<div className="relative z-10 p-10 md:p-16 flex flex-col justify-center h-full">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
					<div>
						<span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium tracking-wider text-white/80 uppercase mb-4 border border-white/20">
							Financial Solutions
						</span>
						<h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
							Flexible Loans. <br />
							<span className="font-bold">Tailored for You.</span>
						</h2>
					</div>

					<Button
						variant="link"
						className="text-white p-0 h-auto font-normal hover:no-underline group/btn"
						onClick={() => navigate("/employee/loans")}>
						View all options{" "}
						<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
					{loanTypes.map((loan) => (
						<div
							key={loan.id}
							className="group/card relative p-8 bg-black/20 hover:bg-white/5 transition-colors cursor-pointer"
							onClick={() => navigate(`/employee/loans/${loan.id}`)}>
							<div className="flex flex-col h-full justify-between gap-8">
								<div>
									<p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2">
										{loan.subtitle}
									</p>
									<h3 className="text-2xl font-semibold text-white mb-3">
										{loan.title}
									</h3>
									<p className="text-white/70 font-light leading-relaxed">
										{loan.description}
									</p>
								</div>

								<div className="flex items-center text-sm font-medium text-white/40 group-hover/card:text-white transition-colors">
									Apply Now{" "}
									<ArrowRight className="ml-2 h-4 w-4 -translate-x-2 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
