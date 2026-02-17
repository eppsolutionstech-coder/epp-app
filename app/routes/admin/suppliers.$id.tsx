import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowLeft,
	Edit,
	ExternalLink,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Store,
	Trash2,
	User,
} from "lucide-react";
import { SupplierUpsertDialog } from "~/components/organism/supplier-upsert-dialog";
import { useDeleteSupplier, useGetSupplierById } from "~/hooks/use-supplier";
import { useGetUsers } from "~/hooks/use-user";

const formatDate = (value: Date | string | null | undefined) => {
	if (!value) {
		return "-";
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return "-";
	}

	return parsedDate.toLocaleDateString();
};

export default function AdminSupplierDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const {
		data: supplier,
		isLoading,
		isError,
	} = useGetSupplierById(id || "", {
		fields: "id, organizationId, name, code, description, contactName, email, phone, website, address, isActive, createdAt, updatedAt",
	});

	const {data: supplierAdmins, isLoading: isLoadingAdmins} = useGetUsers({
		filter: "metadata.employee.id:6984324e98d330714c6d7f65"
	});

	const deleteSupplier = useDeleteSupplier();

	const handleDeleteSupplier = async () => {
		if (!id) {
			return;
		}

		if (
			!confirm(
				"Are you sure you want to deactivate this supplier? This action cannot be undone.",
			)
		) {
			return;
		}

		await deleteSupplier.mutateAsync(id);
		navigate("/admin/suppliers");
	};

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError || !supplier) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
				<div className="rounded-full bg-muted p-4">
					<Store className="h-8 w-8 text-muted-foreground" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight">Supplier not found</h1>
				<p className="max-w-md text-muted-foreground">
					The supplier you are looking for does not exist or has been removed.
				</p>
				<Button asChild variant="outline">
					<Link to="/admin/suppliers">Back to suppliers</Link>
				</Button>
			</div>
		);
	}

	const websiteHref = supplier.website
		? supplier.website.startsWith("http")
			? supplier.website
			: `https://${supplier.website}`
		: null;
	const organizationLabel = supplier.organizationId || "Unassigned";

	return (
		<div className="mx-auto max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between gap-3">
				<Button
					variant="ghost"
					size="icon"
					asChild
					className="h-10 w-10 rounded-full transition-colors hover:bg-muted/60">
					<Link to="/admin/suppliers">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setIsDialogOpen(true)}>
						<Edit className="mr-2 h-4 w-4" />
						Edit Supplier
					</Button>
					<Button
						variant="destructive"
						size="icon"
						onClick={handleDeleteSupplier}
						disabled={deleteSupplier.isPending}>
						{deleteSupplier.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			<Card className="relative overflow-hidden border-border/50 shadow-md">
				<div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-4/10" />
				<CardContent className="relative py-6">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="rounded-xl bg-primary/10 p-3 text-primary">
									<Store className="h-6 w-6" />
								</div>
								<div>
									<h1 className="text-4xl font-bold tracking-tight">
										{supplier.name}
									</h1>
									<p className="text-sm text-muted-foreground">
										Supplier profile and partnership details
									</p>
								</div>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
									{supplier.code}
								</span>
								<Badge
									variant={supplier.isActive ? "default" : "secondary"}
									className={
										supplier.isActive
											? "bg-emerald-500 hover:bg-emerald-600"
											: ""
									}>
									{supplier.isActive ? "Active" : "Inactive"}
								</Badge>
							</div>
						</div>
						<div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-[330px]">
							<div className="rounded-lg border border-border/50 bg-background/80 px-3 py-2">
								<p className="text-xs text-muted-foreground">Email</p>
								<p className="truncate font-medium">{supplier.email || "-"}</p>
							</div>
							<div className="rounded-lg border border-border/50 bg-background/80 px-3 py-2">
								<p className="text-xs text-muted-foreground">Phone</p>
								<p className="font-medium">{supplier.phone || "-"}</p>
							</div>
							<div className="rounded-lg border border-border/50 bg-background/80 px-3 py-2 sm:col-span-2">
								<p className="text-xs text-muted-foreground">Organization</p>
								<p className="font-medium">{organizationLabel}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-12">
				<Card className="border-border/50 shadow-md lg:col-span-7">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Overview</CardTitle>
						<CardDescription>
							General supplier profile and identification details.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="rounded-lg border border-border/50 bg-muted/20 p-4">
							<p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
								{supplier.description || "No description has been added yet."}
							</p>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-lg border border-border/50 px-3 py-2">
								<p className="text-xs text-muted-foreground">Supplier Code</p>
								<p className="font-mono text-sm font-medium">{supplier.code}</p>
							</div>
							<div className="rounded-lg border border-border/50 px-3 py-2">
								<p className="text-xs text-muted-foreground">Organization ID</p>
								<p className="text-sm font-medium">{organizationLabel}</p>
							</div>
							<div className="rounded-lg border border-border/50 px-3 py-2">
								<p className="text-xs text-muted-foreground">Contact Person</p>
								<p className="text-sm font-medium">{supplier.contactName || "-"}</p>
							</div>
							<div className="rounded-lg border border-border/50 px-3 py-2">
								<p className="text-xs text-muted-foreground">Status</p>
								<p className="text-sm font-medium">
									{supplier.isActive ? "Active" : "Inactive"}
								</p>
							</div>
							<div className="rounded-lg border border-border/50 px-3 py-2 sm:col-span-2">
								<p className="text-xs text-muted-foreground">Address</p>
								<p className="whitespace-pre-wrap text-sm font-medium">
									{supplier.address || "-"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-md lg:col-span-5">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">Contact Details</CardTitle>
						<CardDescription>
							Direct communication channels for this supplier.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
							<div className="rounded-full bg-muted p-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="min-w-0">
								<p className="text-xs text-muted-foreground">Email</p>
								<p className="break-all text-sm font-medium">
									{supplier.email || "-"}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
							<div className="rounded-full bg-muted p-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Phone</p>
								<p className="text-sm font-medium">{supplier.phone || "-"}</p>
							</div>
						</div>
						<div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
							<div className="rounded-full bg-muted p-2">
								<User className="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Contact Person</p>
								<p className="text-sm font-medium">{supplier.contactName || "-"}</p>
							</div>
						</div>
						<div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
							<div className="rounded-full bg-muted p-2">
								<MapPin className="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Address</p>
								<p className="whitespace-pre-wrap text-sm font-medium">
									{supplier.address || "-"}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
							<div className="rounded-full bg-muted p-2">
								<ExternalLink className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="min-w-0">
								<p className="text-xs text-muted-foreground">Website</p>
								{websiteHref ? (
									<a
										href={websiteHref}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 break-all text-sm font-medium text-primary hover:underline">
										{supplier.website}
										<ExternalLink className="h-3 w-3" />
									</a>
								) : (
									<p className="text-sm font-medium">-</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-md lg:col-span-12">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">System Information</CardTitle>
						<CardDescription>
							Audit and lifecycle details for this record.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-3">
						<div className="rounded-lg border border-border/50 px-3 py-2">
							<p className="text-xs text-muted-foreground">Supplier ID</p>
							<p className="break-all font-mono text-sm font-medium">{supplier.id}</p>
						</div>
						<div className="rounded-lg border border-border/50 px-3 py-2">
							<p className="text-xs text-muted-foreground">Created</p>
							<p className="text-sm font-medium">{formatDate(supplier.createdAt)}</p>
						</div>
						<div className="rounded-lg border border-border/50 px-3 py-2">
							<p className="text-xs text-muted-foreground">Last Updated</p>
							<p className="text-sm font-medium">{formatDate(supplier.updatedAt)}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<SupplierUpsertDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				supplierId={id}
			/>
		</div>
	);
}
