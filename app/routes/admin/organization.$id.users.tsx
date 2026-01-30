import { useParams } from "react-router";
import { useGetOrganizationById } from "~/hooks/use-organization";
import type { Organization } from "~/zod/organization.zod";
import { OrganizationUsersTab } from "~/components/organism/organization-users-tab";

export default function OrganizationUsersPage() {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useGetOrganizationById(id!, {
		fields: "users.id, users.userName, users.email, users.status, users.lastLogin, users.metadata, users.role.name",
	});

	const organization = data as Organization;

	return (
		<div className="space-y-4">
			<OrganizationUsersTab users={organization?.users || []} isLoading={isLoading} />
		</div>
	);
}
