import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Store, Loader2, Mail, Phone, User, Calendar } from "lucide-react";
import { SupplierUpsertDialog } from "~/components/organism/supplier-upsert-dialog";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import { useDeleteSupplier, useGetSuppliers } from "~/hooks/use-supplier";

export default function AdminsuppliersPage() {
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedsupplierId, setSelectedsupplierId] = useState<string | null>(null);

	const { apiParams, searchTerm, handleSearchChange } = useApiParams({
		limit: 100,
	});

	const { data: suppliersResponse, isLoading, isError } = useGetSuppliers(apiParams);
	const deletesupplier = useDeleteSupplier();

	const suppliers = suppliersResponse?.suppliers || [];

	const handleOpenCreateDialog = () => {
		setSelectedsupplierId(null);
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (supplierId: string) => {
		setSelectedsupplierId(supplierId);
		setIsDialogOpen(true);
	};

	const handleDeletesupplier = async (supplierId: string) => {
		if (confirm("Are you sure you want to deactivate this supplier?")) {
			await deletesupplier.mutateAsync(supplierId);
		}
	};

	const handleViewSupplierDetails = (supplierId: string) => {
		navigate(`/admin/suppliers/${supplierId}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
					<p className="text-muted-foreground">
						Manage your supplier partnerships and listings.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<SearchInput
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search suppliers..."
					/>
					<Button onClick={handleOpenCreateDialog}>
						<Plus className="mr-2 h-4 w-4" />
						Add supplier
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : isError ? (
				<div className="flex items-center justify-center py-16 text-muted-foreground">
					Failed to load suppliers. Please try again.
				</div>
			) : (
				<div className="space-y-4">
					{suppliers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card border-dashed">
							<Store className="h-10 w-10 text-muted-foreground mb-4" />
							<h3 className="font-semibold text-lg">No suppliers found</h3>
							<p className="text-muted-foreground max-w-sm mb-4">
								Get started by adding your first supplier partnership to the
								platform.
							</p>
							<Button onClick={handleOpenCreateDialog} variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add supplier
							</Button>
						</div>
					) : (
						suppliers.map((supplier) => (
							<Card
								key={supplier.id}
								role="button"
								tabIndex={0}
								onClick={() => handleViewSupplierDetails(supplier.id)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										handleViewSupplierDetails(supplier.id);
									}
								}}
								className="cursor-pointer hover:shadow-md transition-shadow duration-200">
								<CardContent className="px-6">
									<div className="flex flex-col lg:flex-row lg:items-center gap-6">
										{/* Icon & Identity */}
										<div className="flex items-start lg:items-center gap-4 min-w-[300px]">
											<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
												<Store className="h-6 w-6" />
											</div>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={(event) => {
															event.stopPropagation();
															handleViewSupplierDetails(supplier.id);
														}}
														className="font-semibold text-lg hover:text-primary transition-colors text-left">
														{supplier.name}
													</button>
													<Badge
														variant={
															supplier.isActive
																? "default"
																: "secondary"
														}
														className={
															supplier.isActive
																? "bg-emerald-500 hover:bg-emerald-600"
																: ""
														}>
														{supplier.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground font-mono">
													{supplier.code}
												</p>
											</div>
										</div>

										{/* Details Grid */}
										<div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6">
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<Mail className="h-3.5 w-3.5" />
													Email
												</p>
												<p
													className="text-sm font-medium truncate"
													title={supplier.email || undefined}>
													{supplier.email || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<Phone className="h-3.5 w-3.5" />
													Phone
												</p>
												<p className="text-sm font-medium">
													{supplier.phone || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<User className="h-3.5 w-3.5" />
													Contact Person
												</p>
												<p className="text-sm font-medium">
													{supplier.contactName || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<Calendar className="h-3.5 w-3.5" />
													Joined Date
												</p>
												<p className="text-sm font-medium">
													{new Date(
														supplier.createdAt,
													).toLocaleDateString()}
												</p>
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-end">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														className="h-8 w-8 p-0"
														onClick={(event) =>
															event.stopPropagation()
														}>
														<span className="sr-only">Open menu</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													onClick={(event) => event.stopPropagation()}>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={(event) => {
															event.stopPropagation();
															handleOpenEditDialog(supplier.id);
														}}>
														Edit supplier
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(event) => {
															event.stopPropagation();
															handleViewSupplierDetails(supplier.id);
														}}>
														View details
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-red-600"
														onClick={(event) => {
															event.stopPropagation();
															handleDeletesupplier(supplier.id);
														}}>
														Deactivate supplier
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}

			<SupplierUpsertDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				supplierId={selectedsupplierId}
			/>
		</div>
	);
}
