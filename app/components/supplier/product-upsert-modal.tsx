import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Save, Loader2, Upload, ImageIcon, X } from "lucide-react";
import type { Item } from "~/zod/item.zod";
import type { CategoryWithRelation } from "~/zod/category.zod";

export interface ItemFormData {
	name: string;
	sku: string;
	description: string;
	categoryId: string;
	srp: string;
	supplierPrice: string;
	stockQuantity: string;
	isActive: boolean;
	featuredImages: File[];
}

interface ProductUpsertModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: Item | null;
	categories?: CategoryWithRelation[];
	onSubmit: (data: FormData) => void;
	isLoading?: boolean;
}

const initialFormData: ItemFormData = {
	name: "",
	sku: "",
	description: "",
	categoryId: "",
	srp: "",
	supplierPrice: "",
	stockQuantity: "0",
	isActive: true,
	featuredImages: [],
};

export function ProductUpsertModal({
	open,
	onOpenChange,
	product,
	categories = [],
	onSubmit,
	isLoading = false,
}: ProductUpsertModalProps) {
	const [formData, setFormData] = useState<ItemFormData>(initialFormData);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const isEditing = !!product;

	// Reset form when modal opens/closes or product changes
	useEffect(() => {
		if (open) {
			if (product) {
				setFormData({
					name: product.name,
					sku: product.sku,
					description: product.description || "",
					categoryId: product.categoryId,
					srp: String(product.srp),
					supplierPrice: String(product.supplierPrice),
					stockQuantity: String(product.stockQuantity),
					isActive: product.isActive,
					featuredImages: [],
				});
				// Set existing image previews if available
				const existingImages = (product as any).images || [];
				setImagePreviews(existingImages.map((img: any) => img.url || img));
			} else {
				setFormData(initialFormData);
				setImagePreviews([]);
			}
		}
	}, [open, product]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const newFiles = Array.from(files);
			setFormData({ ...formData, featuredImages: [...formData.featuredImages, ...newFiles] });
			// Create preview URLs
			const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
			setImagePreviews([...imagePreviews, ...newPreviews]);
		}
		// Reset input value to allow selecting the same file again
		e.target.value = "";
	};

	const handleRemoveImage = (index: number) => {
		const newImages = formData.featuredImages.filter((_, i) => i !== index);
		const newPreviews = imagePreviews.filter((_, i) => i !== index);
		setFormData({ ...formData, featuredImages: newImages });
		setImagePreviews(newPreviews);
	};

	const handleSubmit = () => {
		const data = new FormData();
		data.append("name", formData.name);
		data.append("sku", formData.sku);
		data.append("description", formData.description || "");
		data.append("categoryId", formData.categoryId);
		data.append("srp", formData.srp);
		data.append("supplierPrice", formData.supplierPrice);
		data.append("stockQuantity", formData.stockQuantity);
		data.append("isActive", String(formData.isActive));
		formData.featuredImages.forEach((file) => {
			data.append("featuredImages", file);
		});
		onSubmit(data);
	};

	const handleClose = () => {
		onOpenChange(false);
		setFormData(initialFormData);
		setImagePreviews([]);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the product details below."
							: "Create a new product listing for the EPP catalog."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Image Upload */}
					<div className="space-y-2">
						<Label>Product Images</Label>
						<div className="border-2 border-dashed rounded-lg p-4">
							{imagePreviews.length > 0 && (
								<div className="grid grid-cols-4 gap-2 mb-4">
									{imagePreviews.map((preview, index) => (
										<div key={index} className="relative">
											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												className="w-full h-20 object-cover rounded-md"
											/>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												className="absolute -top-2 -right-2 h-5 w-5"
												onClick={() => handleRemoveImage(index)}
												disabled={isLoading}>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							)}
							<div className="text-center">
								{imagePreviews.length === 0 && (
									<>
										<ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
										<p className="text-sm text-muted-foreground mb-2">
											Drag and drop images, or click to browse
										</p>
									</>
								)}
								<input
									type="file"
									accept="image/*"
									multiple
									className="hidden"
									id="image-upload"
									onChange={handleImageChange}
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => document.getElementById("image-upload")?.click()}
									disabled={isLoading}>
									<Upload className="mr-2 h-4 w-4" />
									{imagePreviews.length > 0 ? "Add More Images" : "Upload Images"}
								</Button>
							</div>
						</div>
					</div>

					<div className="grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Product Name *</Label>
								<Input
									id="name"
									placeholder="Enter product name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									disabled={isLoading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="sku">SKU *</Label>
								<Input
									id="sku"
									placeholder="Enter SKU"
									value={formData.sku}
									onChange={(e) =>
										setFormData({ ...formData, sku: e.target.value })
									}
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Enter product description"
								rows={3}
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="category">Category *</Label>
							<Select
								value={formData.categoryId}
								onValueChange={(value) =>
									setFormData({ ...formData, categoryId: value })
								}
								disabled={isLoading}>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="srp">Retail Price (₱) *</Label>
								<Input
									id="srp"
									type="number"
									placeholder="0.00"
									value={formData.srp}
									onChange={(e) =>
										setFormData({
											...formData,
											srp: e.target.value,
										})
									}
									disabled={isLoading}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="employeePrice">Employee Price (₱) *</Label>
								<Input
									id="employeePrice"
									type="number"
									placeholder="0.00"
									value={formData.supplierPrice}
									onChange={(e) =>
										setFormData({
											...formData,
											supplierPrice: e.target.value,
										})
									}
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="stock">Initial Stock</Label>
							<Input
								id="stock"
								type="number"
								placeholder="0"
								value={formData.stockQuantity}
								onChange={(e) =>
									setFormData({ ...formData, stockQuantity: e.target.value })
								}
								disabled={isLoading}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							!formData.name.trim() ||
							!formData.sku.trim() ||
							!formData.categoryId ||
							!formData.srp ||
							!formData.supplierPrice ||
							isLoading
						}>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : isEditing ? (
							<Save className="mr-2 h-4 w-4" />
						) : (
							<Plus className="mr-2 h-4 w-4" />
						)}
						{isEditing ? "Save Changes" : "Add Product"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
