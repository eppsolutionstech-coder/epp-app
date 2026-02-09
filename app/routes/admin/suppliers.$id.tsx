import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	Store,
	Loader2,
	Mail,
	Phone,
	User,
	Calendar,
	MapPin,
	Globe,
	Edit,
	Trash2,
	ExternalLink,
} from "lucide-react";
import { useGetSupplierById, useDeleteSupplier } from "~/hooks/use-supplier";
import { SupplierUpsertDialog } from "~/components/organism/supplier-upsert-dialog";
import { cn } from "@/lib/utils";

export default function AdminSupplierDetailsPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { data: supplier, isLoading, isError } = useGetSupplierById(id || "");
	const deleteSupplier = useDeleteSupplier();

	const handleDeleteSupplier = async () => {
		if (
			confirm(
				"Are you sure you want to deactivate this supplier? This action cannot be undone.",
			)
		) {
			await deleteSupplier.mutateAsync(id!);
			navigate("/admin/suppliers");
		}
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
			<div className="flex flex-col items-center justify-center py-12 gap-4">
				<div className="bg-muted p-4 rounded-full">
					<Store className="h-8 w-8 text-muted-foreground" />
				</div>
				<h1 className="text-2xl font-bold">Supplier Not Found</h1>
				<p className="text-muted-foreground">
					The supplier you are looking for does not exist or has been removed.
				</p>
				<Button asChild variant="outline">
					<Link to="/admin/suppliers">Back to Suppliers</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						asChild
						className="h-10 w-10 rounded-full hover:bg-muted/50 transition-colors">
						<Link to="/admin/suppliers">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
							<Store className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="font-mono">{supplier.code}</span>
								<span>•</span>
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
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setIsDialogOpen(true)}>
						<Edit className="mr-2 h-4 w-4" />
						Edit Supplier
					</Button>
					<Button variant="destructive" size="icon" onClick={handleDeleteSupplier}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left Column: Contact & Address */}
				<div className="md:col-span-1 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Contact Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-start gap-3">
								<Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
								<div className="space-y-0.5">
									<p className="text-sm font-medium">Email</p>
									<p className="text-sm text-muted-foreground break-all">
										{supplier.email || "-"}
									</p>
								</div>
							</div>
							<Separator />
							<div className="flex items-start gap-3">
								<Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
								<div className="space-y-0.5">
									<p className="text-sm font-medium">Phone</p>
									<p className="text-sm text-muted-foreground">
										{supplier.phone || "-"}
									</p>
								</div>
							</div>
							<Separator />
							<div className="flex items-start gap-3">
								<User className="h-4 w-4 text-muted-foreground mt-0.5" />
								<div className="space-y-0.5">
									<p className="text-sm font-medium">Contact Person</p>
									<p className="text-sm text-muted-foreground">
										{supplier.contactName || "-"}
									</p>
								</div>
							</div>
							<Separator />
							<div className="flex items-start gap-3">
								<Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
								<div className="space-y-0.5">
									<p className="text-sm font-medium">Website</p>
									{supplier.website ? (
										<a
											href={supplier.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-primary hover:underline flex items-center gap-1">
											{supplier.website}
											<ExternalLink className="h-3 w-3" />
										</a>
									) : (
										<p className="text-sm text-muted-foreground">-</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Address</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-3">
								<MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
								<div className="space-y-0.5">
									<p className="text-sm font-medium">Physical Address</p>
									<p className="text-sm text-muted-foreground whitespace-pre-wrap">
										{supplier.address || "No address provided"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">System Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground flex items-center gap-2">
									<Calendar className="h-4 w-4" /> Created
								</span>
								<span className="text-sm font-medium">
									{new Date(supplier.createdAt).toLocaleDateString()}
								</span>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground flex items-center gap-2">
									<Calendar className="h-4 w-4" /> Last Updated
								</span>
								<span className="text-sm font-medium">
									{new Date(supplier.updatedAt).toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column: Overview & Stats (Placeholder for now) */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">About</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
								{supplier.description ||
									"No description available for this supplier."}
							</p>
						</CardContent>
					</Card>

					{/* Future Integration: Products List */}
					<Card className="border-dashed">
						<CardHeader>
							<CardTitle className="text-lg text-muted-foreground">
								Products
							</CardTitle>
						</CardHeader>
						<CardContent className="py-8 text-center text-muted-foreground">
							<p>Product list integration coming soon.</p>
						</CardContent>
					</Card>

					{/* Future Integration: Purchase Orders */}
					<Card className="border-dashed">
						<CardHeader>
							<CardTitle className="text-lg text-muted-foreground">
								Purchase Orders
							</CardTitle>
						</CardHeader>
						<CardContent className="py-8 text-center text-muted-foreground">
							<p>Purchase order history integration coming soon.</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<SupplierUpsertDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				supplierId={id}
			/>
		</div>
	);
}
