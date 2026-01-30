import { useParams, Link, Outlet, useLocation } from "react-router";
import { Building2, Calendar, MoreVertical, ChevronRight } from "lucide-react";
import { useGetOrganizationById } from "~/hooks/use-organization";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import type { Organization } from "~/zod/organization.zod";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function OrganizationDetailsPage() {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const { data, isLoading } = useGetOrganizationById(id!, {
		fields: "id, name, description, code, branding, createdAt, updatedAt",
	});

	const organization = data as Organization; 

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 bg-muted animate-pulse rounded" />
				<div className="h-64 w-full bg-muted animate-pulse rounded" />
			</div>
		);
	}

	if (!organization) {
		return (
			<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
				<Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
				<h1 className="text-2xl font-bold">Organization not found</h1>
				<Button asChild variant="outline">
					<Link to="/admin/organizations">Back to Organizations</Link>
				</Button>
			</div>
		);
	}

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const currentSection = pathSegments[pathSegments.length - 1];

	const sectionNameMap: Record<string, string> = {
		users: "Users",
		products: "Products",
		approvals: "Approvals",
		settings: "Settings",
	};

	const sectionName = sectionNameMap[currentSection];
	const isRoot = !sectionName;

	return (
		<div className="space-y-6">
			{/* Breadcrumb / Back Navigation */}
			<div className="flex items-center text-sm text-muted-foreground">
				<Link to="/admin/organizations" className="hover:text-foreground transition-colors">
					Organizations
				</Link>
				<ChevronRight className="h-4 w-4 mx-2" />
				<Link
					to={`/admin/organization/${id}`}
					className={`hover:text-foreground transition-colors ${isRoot ? "font-medium text-foreground" : ""}`}>
					{organization.name}
				</Link>
				{sectionName && (
					<>
						<ChevronRight className="h-4 w-4 mx-2" />
						<span className="font-medium text-foreground">{sectionName}</span>
					</>
				)}
			</div>

			{/* Header Section */}
			<div className="flex flex-col md:flex-row items-start md:items-center gap-6">
				<Avatar className="h-24 w-24 border-2 border-background shadow-sm">
					<AvatarImage
						src={organization.branding?.logo || undefined}
						alt={organization.name}
					/>
					<AvatarFallback className="text-2xl rounded-lg">
						{organization.name.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{organization.name}
							</h1>
							<div className="flex items-center gap-3 text-muted-foreground mt-1">
								<span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
									{organization.code}
								</span>
								<span>•</span>
								<div className="flex items-center gap-1 text-sm">
									<Calendar className="h-3.5 w-3.5" />
									<span>
										Joined{" "}
										{new Date(organization.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline">Edit Organization</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem className="text-destructive">
										Deactivate
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					{organization.description && (
						<p className="text-muted-foreground max-w-2xl">
							{organization.description}
						</p>
					)}
					<div className="flex items-center gap-2">
						<Badge
							variant={!organization.isDeleted ? "default" : "destructive"}
							className={
								!organization.isDeleted ? "bg-green-600 hover:bg-green-700" : ""
							}>
							{!organization.isDeleted ? "Active" : "Inactive"}
						</Badge>
					</div>
				</div>
			</div>

			<Separator />

			{/* Content Area */}
			<Outlet />
		</div>
	);
}
