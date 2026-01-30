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
import { CreateVendorSchema, type CreateVendor, type Vendor } from "~/zod/vendor.zod";
import { useCreateVendor, useUpdateVendor, useGetVendorById } from "~/hooks/use-vendor";

interface VendorUpsertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	vendorId?: string | null;
}

export function VendorUpsertDialog({ open, onOpenChange, vendorId }: VendorUpsertDialogProps) {
	const isEditMode = !!vendorId;

	const { data: vendorData, isLoading: isLoadingVendor } = useGetVendorById(vendorId || "", {});
	const createVendor = useCreateVendor();
	const updateVendor = useUpdateVendor();

	const form = useForm<CreateVendor>({
		resolver: zodResolver(CreateVendorSchema),
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
		if (isEditMode && vendorData) {
			form.reset({
				name: vendorData.name || "",
				code: vendorData.code || "",
				description: vendorData.description || "",
				contactName: vendorData.contactName || "",
				email: vendorData.email || "",
				phone: vendorData.phone || "",
				website: vendorData.website || "",
				isActive: vendorData.isActive ?? true,
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
	}, [vendorData, isEditMode, form]);

	const handleSubmit = async (data: CreateVendor) => {
		try {
			if (isEditMode && vendorId) {
				await updateVendor.mutateAsync({ vendorId, data });
			} else {
				await createVendor.mutateAsync(data);
			}
			onOpenChange(false);
			form.reset();
		} catch (error) {
			console.error("Failed to save vendor:", error);
		}
	};

	const isSubmitting = createVendor.isPending || updateVendor.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>{isEditMode ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update the vendor details below."
							: "Fill in the details to create a new vendor."}
					</DialogDescription>
				</DialogHeader>

				{isEditMode && isLoadingVendor ? (
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
											<FormLabel>Vendor Name *</FormLabel>
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
											<FormLabel>Vendor Code *</FormLabel>
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
												placeholder="Brief description of the vendor..."
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
													placeholder="e.g. contact@vendor.com"
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
													placeholder="e.g. https://vendor.com"
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
												Enable or disable this vendor
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
										"Update Vendor"
									) : (
										"Create Vendor"
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
