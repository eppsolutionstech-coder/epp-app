import { useState } from "react";
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
import { VendorUpsertDialog } from "~/components/organism/vendor-upsert-dialog";
import { useGetVendors, useDeleteVendor } from "~/hooks/use-vendor";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";

export default function AdminVendorsPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

	const { apiParams, searchTerm, handleSearchChange } = useApiParams({
		limit: 100,
	});

	const { data: vendorsResponse, isLoading, isError } = useGetVendors(apiParams);
	const deleteVendor = useDeleteVendor();

	const vendors = vendorsResponse?.vendors || [];

	const handleOpenCreateDialog = () => {
		setSelectedVendorId(null);
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (vendorId: string) => {
		setSelectedVendorId(vendorId);
		setIsDialogOpen(true);
	};

	const handleDeleteVendor = async (vendorId: string) => {
		if (confirm("Are you sure you want to deactivate this vendor?")) {
			await deleteVendor.mutateAsync(vendorId);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
					<p className="text-muted-foreground">
						Manage your vendor partnerships and listings.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<SearchInput
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search vendors..."
					/>
					<Button onClick={handleOpenCreateDialog}>
						<Plus className="mr-2 h-4 w-4" />
						Add Vendor
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : isError ? (
				<div className="flex items-center justify-center py-16 text-muted-foreground">
					Failed to load vendors. Please try again.
				</div>
			) : (
				<div className="space-y-4">
					{vendors.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card border-dashed">
							<Store className="h-10 w-10 text-muted-foreground mb-4" />
							<h3 className="font-semibold text-lg">No vendors found</h3>
							<p className="text-muted-foreground max-w-sm mb-4">
								Get started by adding your first vendor partnership to the platform.
							</p>
							<Button onClick={handleOpenCreateDialog} variant="outline">
								<Plus className="mr-2 h-4 w-4" />
								Add Vendor
							</Button>
						</div>
					) : (
						vendors.map((vendor) => (
							<Card
								key={vendor.id}
								className="hover:shadow-md transition-shadow duration-200">
								<CardContent className="px-6">
									<div className="flex flex-col lg:flex-row lg:items-center gap-6">
										{/* Icon & Identity */}
										<div className="flex items-start lg:items-center gap-4 min-w-[300px]">
											<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
												<Store className="h-6 w-6" />
											</div>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
														{vendor.name}
													</h3>
													<Badge
														variant={
															vendor.isActive
																? "default"
																: "secondary"
														}
														className={
															vendor.isActive
																? "bg-emerald-500 hover:bg-emerald-600"
																: ""
														}>
														{vendor.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground font-mono">
													{vendor.code}
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
													title={vendor.email || undefined}>
													{vendor.email || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<Phone className="h-3.5 w-3.5" />
													Phone
												</p>
												<p className="text-sm font-medium">
													{vendor.phone || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<User className="h-3.5 w-3.5" />
													Contact Person
												</p>
												<p className="text-sm font-medium">
													{vendor.contactName || "-"}
												</p>
											</div>
											<div className="space-y-1">
												<p className="text-xs text-muted-foreground flex items-center gap-1.5">
													<Calendar className="h-3.5 w-3.5" />
													Joined Date
												</p>
												<p className="text-sm font-medium">
													{new Date(
														vendor.createdAt,
													).toLocaleDateString()}
												</p>
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center justify-end">
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
															handleOpenEditDialog(vendor.id)
														}>
														Edit Vendor
													</DropdownMenuItem>
													<DropdownMenuItem>
														View Products
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-red-600"
														onClick={() =>
															handleDeleteVendor(vendor.id)
														}>
														Deactivate Vendor
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

			<VendorUpsertDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				vendorId={selectedVendorId}
			/>
		</div>
	);
}
