import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Createsupplierschema, type Createsupplier, type supplier } from "~/zod/supplier.zod";
import { useCreateSupplier, useGetSupplierById, useUpdateSupplier } from "~/hooks/use-supplier";

interface supplierUpsertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	supplierId?: string | null;
}

export function SupplierUpsertDialog({
	open,
	onOpenChange,
	supplierId,
}: supplierUpsertDialogProps) {
	const isEditMode = !!supplierId;

	const { data: supplierData, isLoading: isLoadingsupplier } = useGetSupplierById(
		supplierId || "",
		{},
	);
	const createsupplier = useCreateSupplier();
	const updatesupplier = useUpdateSupplier();

	const form = useForm<Createsupplier>({
		resolver: zodResolver(Createsupplierschema),
		defaultValues: {
			name: "",
			code: "",
			description: "",
			contactName: "",
			email: "",
			phone: "",
			website: "",
			isActive: true,
		},
	});

	// Populate form when editing
	useEffect(() => {
		if (isEditMode && supplierData) {
			form.reset({
				name: supplierData.name || "",
				code: supplierData.code || "",
				description: supplierData.description || "",
				contactName: supplierData.contactName || "",
				email: supplierData.email || "",
				phone: supplierData.phone || "",
				website: supplierData.website || "",
				isActive: supplierData.isActive ?? true,
			});
		} else if (!isEditMode) {
			form.reset({
				name: "",
				code: "",
				description: "",
				contactName: "",
				email: "",
				phone: "",
				website: "",
				isActive: true,
			});
		}
	}, [supplierData, isEditMode, form]);

	const handleSubmit = async (data: Createsupplier) => {
		try {
			if (isEditMode && supplierId) {
				await updatesupplier.mutateAsync({ supplierId, data });
			} else {
				await createsupplier.mutateAsync(data);
			}
			onOpenChange(false);
			form.reset();
		} catch (error) {
			console.error("Failed to save supplier:", error);
		}
	};

	const isSubmitting = createsupplier.isPending || updatesupplier.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Edit supplier" : "Add New supplier"}</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update the supplier details below."
							: "Fill in the details to create a new supplier."}
					</DialogDescription>
				</DialogHeader>

				{isEditMode && isLoadingsupplier ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>supplier Name *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. TechWorld Electronics"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>supplier Code *</FormLabel>
											<FormControl>
												<Input placeholder="e.g. TWE-001" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Brief description of the supplier..."
												className="min-h-[80px]"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="contactName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contact Person</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. John Doe"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. +1 555-0101"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="e.g. contact@supplier.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Website</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. https://supplier.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Active Status</FormLabel>
											<p className="text-sm text-muted-foreground">
												Enable or disable this supplier
											</p>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="flex justify-end gap-3 pt-4 border-t">
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : isEditMode ? (
										"Update supplier"
									) : (
										"Create supplier"
									)}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
