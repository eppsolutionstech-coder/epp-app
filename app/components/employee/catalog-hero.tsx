import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, CreditCard } from "lucide-react";
import { useNavigate } from "react-router";

const SLIDES = [
	{
		id: 1,
		badge: "Exclusive Benefits",
		title: (
			<>
				Shop Top Brands. <br />
				<span className="font-bold">Pay via Payroll.</span>
			</>
		),
		description: (
			<>
				Get premium products from our trusted partners.
				<br className="hidden md:block" />
				Enjoy flexible installment plans deducted directly from your salary.
			</>
		),
		image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
		buttonText: "Browse Catalog",
		link: "/employee/catalog",
		icon: Building2,
	},
	{
		id: 2,
		badge: "Financial Wellness", // New Loan System Category
		title: (
			<>
				Trusted Loans. <br />
				<span className="font-bold">Simple Repayment.</span>
			</>
		),
		description: (
			<>
				Access secure loans from our vetted financial partners.
				<br className="hidden md:block" />
				Easy application with automatic payments via payroll deduction.
			</>
		),
		image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop", // Finance/Business meeting image
		buttonText: "Explore Loans",
		link: "/employee/loans",
		icon: CreditCard,
	},
];

export function CatalogHero() {
	const navigate = useNavigate();
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
		}, 6000); // 6 seconds per slide
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="relative w-full h-[500px] overflow-hidden rounded-2xl group bg-black">
			{/* Slides */}
			{SLIDES.map((slide, index) => {
				const isActive = index === currentSlide;
				return (
					<div
						key={slide.id}
						className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
							isActive ? "opacity-100 z-10" : "opacity-0 z-0"
						}`}>
						{/* Background Image */}
						<div className="absolute inset-0">
							<img
								src={slide.image}
								alt="Hero Background"
								className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-linear ${
									isActive ? "scale-110" : "scale-100"
								}`}
							/>
							{/* Overlay */}
							<div className="absolute inset-0 bg-black/40" />
							{/* Gradient for text readability */}
							<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
						</div>

						{/* Content */}
						<div className="relative h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl text-white">
							<div
								className={`transition-all duration-700 delay-100 transform ${
									isActive
										? "translate-y-0 opacity-100"
										: "translate-y-4 opacity-0"
								}`}>
								<span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium tracking-wider uppercase mb-6 w-fit border border-white/30">
									<slide.icon className="h-3 w-3" />
									{slide.badge}
								</span>

								<h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
									{slide.title}
								</h1>

								<p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light">
									{slide.description}
								</p>

								<Button
									size="lg"
									onClick={() => navigate(slide.link)}
									className="h-14 px-8 text-base rounded-full bg-white text-black hover:bg-white/90 border-0 shadow-lg hover:scale-105 transition-all duration-300">
									{slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				);
			})}

			{/* Slide Indicators */}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{SLIDES.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentSlide(index)}
						className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
							index === currentSlide
								? "w-8 bg-white"
								: "w-2 bg-white/40 hover:bg-white/60"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
