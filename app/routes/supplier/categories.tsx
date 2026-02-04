import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Plus,
	MoreHorizontal,
	FolderOpen,
	Search,
	ArrowLeft,
	Pencil,
	Trash2,
	Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { useGetCategories, useCreateCategory, useUpdateCategory } from "~/hooks/use-category";
import { CategoryUpsertModal } from "~/components/supplier/category-upsert-modal";
import type { CategoryWithRelation } from "~/zod/category.zod";
import { toast } from "sonner";

export default function supplierCategoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<CategoryWithRelation | null>(null);

	// Fetch categories
	const {
		data: categoriesResponse,
		isLoading,
		isError,
	} = useGetCategories({
		limit: 100,
		query: searchQuery,
		fields: "id, name, slug, description, parent.name, isActive",
	});

	// Mutations
	const createCategory = useCreateCategory();
	const updateCategory = useUpdateCategory();

	const categories: CategoryWithRelation[] = categoriesResponse?.categorys || [];

	const handleOpenCreateModal = () => {
		setEditingCategory(null);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (category: CategoryWithRelation) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const handleSubmit = async (formData: {
		name: string;
		slug: string;
		description: string;
		parentId: string;
		isActive: boolean;
	}) => {
		const payload = {
			name: formData.name,
			slug: formData.slug,
			description: formData.description || null,
			parentId: formData.parentId || null,
			isActive: formData.isActive,
		};

		try {
			if (editingCategory) {
				await updateCategory.mutateAsync({
					categoryId: editingCategory.id,
					data: payload,
				});
				toast.success("Category updated successfully");
			} else {
				await createCategory.mutateAsync(payload);
				toast.success("Category created successfully");
			}
			setIsModalOpen(false);
			setEditingCategory(null);
		} catch (error: any) {
			toast.error(error.message || "An error occurred");
		}
	};

	const isMutating = createCategory.isPending || updateCategory.isPending;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link to="/supplier/products">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
						<p className="text-muted-foreground">
							Manage product categories for your catalog.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search categories..."
							className="pl-8 w-[200px] lg:w-[280px] bg-white border-input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button onClick={handleOpenCreateModal}>
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Button>
				</div>
			</div>

			{/* Categories Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Categories</CardTitle>
					<CardDescription>
						{categories.length} categor{categories.length !== 1 ? "ies" : "y"} in your
						catalog
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : isError ? (
						<div className="text-center py-8 text-muted-foreground">
							Failed to load categories. Please try again.
						</div>
					) : categories.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No categories found. Create your first category to get started.
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Category</TableHead>
									<TableHead>Parent</TableHead>
									<TableHead>Products</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{categories.map((category) => (
									<TableRow key={category.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
													<FolderOpen className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{category.name}</p>
													<p className="text-xs text-muted-foreground">
														/{category.slug}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{category.parent ? (
												<Badge variant="outline">
													{category.parent.name}
												</Badge>
											) : (
												<span className="text-muted-foreground">â€”</span>
											)}
										</TableCell>
										<TableCell>{category._count?.products ?? 0}</TableCell>
										<TableCell>
											<Badge
												variant={
													category.isActive ? "default" : "secondary"
												}>
												{category.isActive ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Open menu</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() =>
															handleOpenEditModal(category)
														}>
														<Pencil className="mr-2 h-4 w-4" />
														Edit Category
													</DropdownMenuItem>
													<DropdownMenuItem className="text-red-600">
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Category
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Upsert Modal */}
			<CategoryUpsertModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				category={editingCategory}
				categories={categories}
				onSubmit={handleSubmit}
				isLoading={isMutating}
			/>
		</div>
	);
}

