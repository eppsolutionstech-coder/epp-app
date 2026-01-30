import { Link, useParams } from "react-router";
import { User, FileCheck, Settings, ArrowRight, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function OrganizationIndexPage() {
	const { id } = useParams<{ id: string }>();

	const actions = [
		{
			title: "Manage Users",
			description: "View and manage organization users, roles, and permissions.",
			icon: User,
			href: `/admin/organization/${id}/users`,
			color: "text-blue-500",
		},
		{
			title: "Organization Products",
			description: "View and manage products associated with this organization.",
			icon: Package,
			href: `/admin/organization/${id}/products`,
			color: "text-purple-500",
		},
		{
			title: "Approval Workflows",
			description: "Configure approval levels and workflows for this organization.",
			icon: FileCheck,
			href: `/admin/organization/${id}/approvals`,
			color: "text-green-500",
		},
		{
			title: "Settings",
			description: "Update organization details, branding, and other configurations.",
			icon: Settings,
			href: `/admin/organization/${id}/settings`,
			color: "text-orange-500",
		},
	];

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{actions.map((action) => (
				<Link key={action.title} to={action.href}>
					<Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-lg font-medium">{action.title}</CardTitle>
							<action.icon className={`h-5 w-5 ${action.color}`} />
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4">
								{action.description}
							</p>
							<div className="flex items-center text-sm font-medium text-primary group-hover:underline">
								Open
								<ArrowRight className="ml-1 h-3 w-3" />
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
}
