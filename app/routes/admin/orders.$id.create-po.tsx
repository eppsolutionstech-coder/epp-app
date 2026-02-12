import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useGetOrderById } from "~/hooks/use-order";
import { useGetSuppliers } from "~/hooks/use-supplier";
import { useCreatePurchaseOrder } from "~/hooks/use-purchase-order";
import { CreatePurchaseOrderSchema, type CreatePurchaseOrder } from "~/zod/purchaseOrder.zod";

export default function CreatePurchaseOrderPage() {
	const { id: orderId } = useParams();
	const navigate = useNavigate();

	// Fetch Order to pre-fill items and info
	const { data: orderResponse, isLoading: isLoadingOrder } = useGetOrderById(orderId || "", {
		fields: "id, orderNumber, orderItems.item.id, orderItems.item.sku, orderItems.item.name, orderItems.item.description, orderItems.quantity, orderItems.unitPrice",
	});
	const order = orderResponse as any;
	const orderItems = order?.orderItems || [];

	const { data: suppliersResponse, isLoading: isLoadingSuppliers } = useGetSuppliers({
		fields: "id,name",
		limit: 100,
	});
	const suppliers = (suppliersResponse as any)?.suppliers || [];

	const createPO = useCreatePurchaseOrder();

	const form = useForm<CreatePurchaseOrder>({
		resolver: zodResolver(CreatePurchaseOrderSchema) as any,
		defaultValues: {
			orderId: orderId || "",
			supplierId: "",
			status: "PENDING",
			requisitioner: {
				name: "",
				designation: "",
				department: "",
				address: "",
			},
			contactName: "",
			contactNumber: "",
			contactEmail: "",
		},
	});

	// Pre-fill form when order loads
	useEffect(() => {
		if (order) {
			form.setValue("orderId", order.id);

			// Pre-fill contact info if available (e.g., from logged in user or config)
			// For now leaving blank or could fill from user profile if we had that context readily compliant to schema
		}
	}, [order, form]);

	const onSubmit = async (data: CreatePurchaseOrder) => {
		try {
			const payload = CreatePurchaseOrderSchema.parse({
				...data,
				requisitioner: data.requisitioner?.name?.trim()
					? {
							name: data.requisitioner.name.trim(),
							designation: data.requisitioner.designation?.trim() || null,
							department: data.requisitioner.department?.trim() || null,
							address: data.requisitioner.address?.trim() || null,
						}
					: null,
				items:
					orderItems.length > 0
						? orderItems.map((orderItem: any) => ({
								itemId: orderItem.item?.id || null,
								sku: orderItem.item?.sku || "N/A",
								description:
									orderItem.item?.name || orderItem.item?.description || null,
								quantity: orderItem.quantity,
								unitPrice: orderItem.unitPrice ?? null,
							}))
						: undefined,
			});
			await createPO.mutateAsync(payload);
			toast.success("Purchase Order created successfully");
			navigate(`/admin/orders/${orderId}`);
		} catch (error) {
			console.error("Failed to create PO:", error);
			toast.error("Failed to create Purchase Order");
		}
	};

	if (isLoadingOrder) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!order) {
		return <div>Order not found</div>;
	}

	const subTotal = orderItems.reduce(
		(sum: number, item: any) => sum + (item.quantity || 0) * (item.unitPrice || 0),
		0,
	);
	// Assuming VAT inclusive for simplicity or adding calculation logic as needed
	const totalVatInc = subTotal;

	return (
		<div className="max-w-6xl mx-auto space-y-6 pb-20">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(`/admin/orders/${orderId}`)}
					className="h-10 w-10 rounded-full hover:bg-muted/50">
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Create Purchase Order</h1>
					<p className="text-muted-foreground">PO for Order #{order.orderNumber}</p>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* Header Section */}
					<Card className="overflow-hidden">
						<CardHeader className="bg-muted/50 pb-4">
							<div className="flex justify-between items-start">
								<div className="flex items-center gap-3">
									<div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center text-primary font-bold text-xl">
										PO
									</div>
									<div>
										<CardTitle>Purchase Order Details</CardTitle>
										<p className="text-sm text-muted-foreground">
											Fill in the details below to generate the PO.
										</p>
									</div>
								</div>
								<div className="text-right space-y-1">
									<div className="flex items-center gap-2 justify-end">
										<span className="w-20 text-right font-bold text-xs uppercase text-muted-foreground">
											Date
										</span>
										<span className="w-40 text-right text-sm font-medium">
											{new Date().toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						</CardHeader>

						<CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Supplier Selection */}
							<div className="space-y-4">
								<h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Supplier Details
								</h3>

								<FormField
									control={form.control}
									name="supplierId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Supplier *</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a supplier" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{suppliers.map((supplier: any) => (
														<SelectItem key={supplier.id} value={supplier.id}>
															{supplier.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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
												<FormLabel>Contact Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Sales Rep Name"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="contactNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Contact Number</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="+63..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="contactEmail"
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormLabel>Contact Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="email@supplier.com"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Shipping & Delivery Terms */}
							<div className="space-y-4">
								<h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Delivery Terms
								</h3>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="leadTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Lead Time (Days)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value))
														}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="availability"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Availability</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="e.g. In Stock"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="delivery"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Expected Delivery</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="pdc"
										render={({ field }) => (
											<FormItem>
												<FormLabel>PDC Date</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
														value={field.value ?? ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Requisitioner Info */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base uppercase tracking-wide text-muted-foreground">
								Requisitioner Details
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="requisitioner.name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name *</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Requester Name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="requisitioner.designation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Designation</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder="Job Title"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="requisitioner.department"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder="Department"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="requisitioner.address"
								render={({ field }) => (
									<FormItem className="md:col-span-3">
										<FormLabel>Shipped To</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder="1234 Tech Avenue, Innovation City, Philippines"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Order Items */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base uppercase tracking-wide text-muted-foreground">
								Order Items
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-[1fr_2fr_100px_150px] gap-4 text-xs font-bold text-muted-foreground px-2">
									<div>SKU/Code</div>
									<div>Description</div>
									<div className="text-center">Qty</div>
									<div className="text-right">Unit Price</div>
								</div>
								<Separator />
								{orderItems.map((orderItem: any, index: number) => (
									<div
										key={
											orderItem.item?.id ||
											`${orderItem.item?.sku || "item"}-${index}`
										}
										className="grid grid-cols-[1fr_2fr_100px_150px] gap-4 items-start animate-in fade-in slide-in-from-top-1">
										<div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
											{orderItem.item?.sku || "N/A"}
										</div>
										<div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
											{orderItem.item?.name ||
												orderItem.item?.description ||
												"-"}
										</div>
										<div className="rounded-md border bg-muted/20 px-3 py-2 text-center text-sm">
											{orderItem.quantity || 0}
										</div>
										<div className="rounded-md border bg-muted/20 px-3 py-2 text-right text-sm">
											₱ {(orderItem.unitPrice || 0).toLocaleString()}
										</div>
									</div>
								))}
								{orderItems.length === 0 && (
									<p className="px-2 text-sm text-muted-foreground">
										No items found for this order.
									</p>
								)}

								<Separator className="my-4" />
								<div className="flex flex-col items-end gap-2 pr-2">
									<div className="flex gap-8 text-sm">
										<span className="font-medium text-muted-foreground w-32 text-right">
											Subtotal:
										</span>
										<span className="font-bold w-32 text-right">
											₱ {subTotal.toLocaleString()}
										</span>
									</div>
									<div className="flex gap-8 text-base">
										<span className="font-medium text-muted-foreground w-32 text-right">
											Total:
										</span>
										<span className="font-bold w-32 text-right text-primary">
											₱ {totalVatInc.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base uppercase tracking-wide text-muted-foreground">
								Additional Notes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												{...field}
												value={field.value || ""}
												placeholder="Any special instructions or notes for this PO..."
												className="min-h-[100px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-4 pb-8">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate(`/admin/orders/${orderId}`)}>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={createPO.isPending}
							className="min-w-[150px]">
							{createPO.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Create Purchase Order
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
