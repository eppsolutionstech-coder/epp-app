import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import type { OrganizationUser } from "~/zod/organization.zod";

interface OrganizationUsersTabProps {
	users: OrganizationUser[];
	isLoading?: boolean;
}

export function OrganizationUsersTab({ users, isLoading }: OrganizationUsersTabProps) {
	const columns: DataTableColumn<OrganizationUser>[] = [
		{
			key: "userName",
			label: "User",
			sortable: true,
			searchable: true,
			render: (_, row) => (
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={row.metadata?.person?.personalInfo?.avatar} />
						<AvatarFallback>
							{row.metadata?.person?.personalInfo?.firstName?.[0] ||
								row.userName?.[0] ||
								"U"}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">
							{row.metadata?.person?.personalInfo?.firstName ? (
								<>
									{row.metadata.person.personalInfo.firstName}{" "}
									{row.metadata.person.personalInfo.lastName}
								</>
							) : (
								row.userName
							)}
						</div>
						<div className="text-sm text-muted-foreground">{row.email}</div>
					</div>
				</div>
			),
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ value: "active", label: "Active", key: "status" },
				{ value: "inactive", label: "Inactive", key: "status" },
				{ value: "suspended", label: "Suspended", key: "status" },
			],
			render: (value) => <Badge variant="outline">{String(value)}</Badge>,
		},
		{
			key: "role" as keyof OrganizationUser,
			label: "Role",
			sortable: true,
			render: (value, row) => (
				<Badge variant="secondary" className="capitalize">
					{row.role?.name || "N/A"}
				</Badge>
			),
		},
		{
			key: "lastLogin" as keyof OrganizationUser,
			label: "Last Login",
			sortable: true,
			render: (value) => {
				if (!value) return "Never";
				return new Date(String(value)).toLocaleDateString();
			},
		},
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							Organization Users
							<Badge variant="secondary" className="ml-2">
								{users.length}
							</Badge>
						</CardTitle>
						<CardDescription className="mt-1.5">
							Manage users associated with this organization.
						</CardDescription>
					</div>
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add User
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable
					columns={columns}
					data={users}
					isLoading={isLoading}
					skeletonRowCount={5}
					className="border rounded-md"
				/>
			</CardContent>
		</Card>
	);
}
