import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Loader2 } from "lucide-react";
import type { CategoryWithRelation } from "~/zod/category.zod";
import { generateSlug } from "~/zod/category.zod";

interface CategoryFormData {
	name: string;
	slug: string;
	description: string;
	parentId: string;
	isActive: boolean;
}

interface CategoryUpsertModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: CategoryWithRelation | null;
	categories?: CategoryWithRelation[];
	onSubmit: (data: CategoryFormData) => void;
	isLoading?: boolean;
}

const initialFormData: CategoryFormData = {
	name: "",
	slug: "",
	description: "",
	parentId: "",
	isActive: true,
};

export function CategoryUpsertModal({
	open,
	onOpenChange,
	category,
	categories = [],
	onSubmit,
	isLoading = false,
}: CategoryUpsertModalProps) {
	const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
	const [autoSlug, setAutoSlug] = useState(true);

	const isEditing = !!category;

	// Reset form when modal opens/closes or category changes
	useEffect(() => {
		if (open) {
			if (category) {
				setFormData({
					name: category.name,
					slug: category.slug,
					description: category.description || "",
					parentId: category.parentId || "",
					isActive: category.isActive,
				});
				setAutoSlug(false);
			} else {
				setFormData(initialFormData);
				setAutoSlug(true);
			}
		}
	}, [open, category]);

	// Auto-generate slug from name
	useEffect(() => {
		if (autoSlug && formData.name) {
			setFormData((prev) => ({
				...prev,
				slug: generateSlug(formData.name),
			}));
		}
	}, [formData.name, autoSlug]);

	const handleNameChange = (value: string) => {
		setFormData((prev) => ({ ...prev, name: value }));
	};

	const handleSlugChange = (value: string) => {
		setAutoSlug(false);
		setFormData((prev) => ({ ...prev, slug: value }));
	};

	const handleSubmit = () => {
		onSubmit(formData);
	};

	const handleClose = () => {
		onOpenChange(false);
		setFormData(initialFormData);
		setAutoSlug(true);
	};

	// Filter out current category from parent options (can't be its own parent)
	const parentOptions = categories.filter((cat) => cat.id !== category?.id);

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the category details below."
							: "Create a new category for organizing your products."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Category Name *</Label>
						<Input
							id="name"
							placeholder="Enter category name"
							value={formData.name}
							onChange={(e) => handleNameChange(e.target.value)}
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">Slug</Label>
						<Input
							id="slug"
							placeholder="category-slug"
							value={formData.slug}
							onChange={(e) => handleSlugChange(e.target.value)}
							disabled={isLoading}
						/>
						<p className="text-xs text-muted-foreground">
							Auto-generated from name. Edit to customize.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter category description"
							rows={3}
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="parentId">Parent Category</Label>
						<Select
							value={formData.parentId || "none"}
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									parentId: value === "none" ? "" : value,
								}))
							}
							disabled={isLoading}>
							<SelectTrigger>
								<SelectValue placeholder="Select parent category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None (Top Level)</SelectItem>
								{parentOptions.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="isActive">Active</Label>
							<p className="text-xs text-muted-foreground">
								Inactive categories won't be visible
							</p>
						</div>
						<Switch
							id="isActive"
							checked={formData.isActive}
							onCheckedChange={(checked) =>
								setFormData((prev) => ({ ...prev, isActive: checked }))
							}
							disabled={isLoading}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!formData.name.trim() || isLoading}>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : isEditing ? (
							<Save className="mr-2 h-4 w-4" />
						) : (
							<Plus className="mr-2 h-4 w-4" />
						)}
						{isEditing ? "Save Changes" : "Add Category"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
