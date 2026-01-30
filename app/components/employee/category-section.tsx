import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

const categories = [
	{
		id: "electronics",
		label: "Electronics",
		image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2070",
		isLarge: true,
	},
	{
		id: "fashion",
		label: "Fashion",
		image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
		isLarge: false,
	},
	{
		id: "home",
		label: "Home & Living",
		image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop",
		isLarge: false,
	},
	{
		id: "sports",
		label: "Sports",
		image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
		isLarge: false,
	},
	{
		id: "beauty",
		label: "Beauty",
		image: "https://thumbs.dreamstime.com/b/dried-pampas-grass-arrangement-minimalist-vase-marble-table-neutral-colors-soft-light-aesthetic-decor-modern-home-design-384842083.jpg",
		isLarge: false,
	},
];

export function CategorySection() {
	const navigate = useNavigate();

	const handleCategoryClick = (categoryId: string) => {
		// Navigate to catalog with category filter (future implementation)
		// For now just go to catalog
		navigate(`/employee/catalog?category=${categoryId}`);
	};

	const largeCategory = categories.find((c) => c.isLarge);
	const smallCategories = categories.filter((c) => !c.isLarge);

	return (
		<section className="">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
				<button
					onClick={() => navigate("/employee/catalog")}
					className="text-sm font-medium text-primary hover:underline underline-offset-4">
					View All Categories
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[500px]">
				{/* Large Feature Category (Left Side) */}
				{largeCategory && (
					<div
						key={largeCategory.id}
						onClick={() => handleCategoryClick(largeCategory.id)}
						className="relative h-full w-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300">
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
						<img
							src={largeCategory.image}
							alt={largeCategory.label}
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
							<h3 className="text-3xl font-bold text-white mb-2">
								{largeCategory.label}
							</h3>
							<p className="text-white/90 font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
								Shop Now &rarr;
							</p>
						</div>
					</div>
				)}

				{/* Grid of 4 Smaller Categories (Right Side) */}
				<div className="grid grid-cols-2 gap-4 h-full">
					{smallCategories.map((category) => (
						<div
							key={category.id}
							onClick={() => handleCategoryClick(category.id)}
							className="relative h-full w-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300">
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
							<img
								src={category.image}
								alt={category.label}
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
								<h3 className="text-lg font-bold text-white mb-1">
									{category.label}
								</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
