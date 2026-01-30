const partners = [
	{
		name: "Samsung",
		logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
	},
	{ name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/HP_New_Logo_2D.svg" },
	{ name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
	{
		name: "LG",
		logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg",
	},
	{
		name: "Dell",
		logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
	},
	{
		name: "Lenovo",
		logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
	},
	{ name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg" },
	{ name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" },
	{
		name: "Apple",
		logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
	},
	{
		name: "Microsoft",
		logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
	},
	{
		name: "Logitech",
		logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo_2015.svg",
	},
	{
		name: "Canon",
		logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Canon_wordmark.svg/1024px-Canon_wordmark.svg.png",
	},
];

export function PartnerBrandsSection() {
	return (
		<section className="py-4 bg-muted/30 overflow-hidden">
			{/* <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
				<h2 className="text-xl font-semibold text-muted-foreground uppercase tracking-widest">
					Trusted Partners
				</h2>
			</div> */}

			<div className="relative w-full">
				<div className="flex w-[200%] animate-scroll">
					{/* First set of logos */}
					<div className="flex w-1/2 justify-around items-center gap-12 px-12">
						{partners.map((partner, index) => (
							<div
								key={`${partner.name}-${index}-1`}
								className="relative h-12 w-32 flex items-center justify-center group">
								<img
									src={partner.logo}
									alt={partner.name}
									className="max-h-12 max-w-full object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 mix-blend-multiply dark:mix-blend-screen"
								/>
							</div>
						))}
					</div>

					{/* Duplicate set for seamless scrolling */}
					<div className="flex w-1/2 justify-around items-center gap-12 px-12">
						{partners.map((partner, index) => (
							<div
								key={`${partner.name}-${index}-2`}
								className="relative h-12 w-32 flex items-center justify-center group">
								<img
									src={partner.logo}
									alt={partner.name}
									className="max-h-12 max-w-full object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 mix-blend-multiply dark:mix-blend-screen"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
