import { useState } from "react";
import {
	Building2,
	MoreVertical,
	Plus,
	Search,
	Users,
	CreditCard,
	Calendar,
	Mail,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useGetOrganizations } from "~/hooks/use-organization";
import type { Organization } from "~/zod/organization.zod";
import { Link } from "react-router";

export default function Organizations() {
	const [searchQuery, setSearchQuery] = useState("");
	const { data, isLoading } = useGetOrganizations({
		fields: "id, name, description, code, branding, createdAt, updatedAt, users.id",
	});

	const organizations = (data?.organizations as Organization[]) || [];

	const filteredOrganizations = organizations.filter((org) =>
		org.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
						<div className="h-4 w-96 bg-muted animate-pulse rounded" />
					</div>
					<div className="h-10 w-40 bg-muted animate-pulse rounded" />
				</div>
				<div className="h-10 w-full max-w-sm bg-muted animate-pulse rounded" />
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card key={i} className="overflow-hidden">
							<CardHeader className="flex flex-row items-start justify-between space-y-0">
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
									<div className="space-y-1">
										<div className="h-4 w-32 bg-muted animate-pulse rounded" />
										<div className="h-3 w-16 bg-muted animate-pulse rounded" />
									</div>
								</div>
							</CardHeader>
							<CardContent className="grid gap-4 mt-2">
								<div className="h-4 w-full bg-muted animate-pulse rounded" />
								<div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
					<p className="text-muted-foreground mt-1">
						Manage client organizations and their subscription details.
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Organization
				</Button>
			</div>

			<div className="flex items-center space-x-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search organizations..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{filteredOrganizations.map((org) => (
					<Link to={`/admin/organization/${org.id}`} key={org.id}>
						<Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
							<CardHeader className="flex flex-row items-start justify-between space-y-0">
								<div className="flex items-center gap-3">
									<Avatar className="h-10 w-10 border">
										<AvatarImage
											src={org.branding?.logo || undefined}
											alt={org.name}
										/>
										<AvatarFallback className="rounded-lg">
											{org.name.substring(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="font-semibold leading-none tracking-tight">
											{org.name}
										</h3>
										<p className="text-sm text-muted-foreground mt-1">
											{org.code}
										</p>
									</div>
								</div>
								<div onClick={(e) => e.preventDefault()}>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>View details</DropdownMenuItem>
											<DropdownMenuItem>Manage subscription</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive">
												Deactivate
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>
							<CardContent className="grid gap-4 mt-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center text-sm text-muted-foreground">
										<Badge
											variant="secondary"
											className={
												!org.isDeleted
													? "bg-green-500/15 text-green-700 hover:bg-green-500/25"
													: "bg-red-500/15 text-red-700 hover:bg-red-500/25"
											}>
											{!org.isDeleted ? "Active" : "Deleted"}
										</Badge>
									</div>
								</div>

								<div className="grid gap-2 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4 opacity-70" />
										<span>
											{(org.users?.length || 0).toLocaleString()} employees
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 opacity-70" />
										<span>
											Joined {new Date(org.createdAt).toLocaleDateString()}
										</span>
									</div>
									{org.description && (
										<p className="text-xs line-clamp-2 mt-2">
											{org.description}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{filteredOrganizations.length === 0 && (
				<div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
					<Building2 className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
					<h3 className="text-lg font-semibold">No organizations found</h3>
					<p className="text-muted-foreground text-sm max-w-[250px] mt-1">
						Try adjusting your search query or add a new organization.
					</p>
				</div>
			)}
		</div>
	);
}
