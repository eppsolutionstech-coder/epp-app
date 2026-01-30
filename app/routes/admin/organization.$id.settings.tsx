import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function OrganizationSettingsPage() {
	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Organization Settings</CardTitle>
					<CardDescription>Manage configuration and preferences.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground">
						Settings configuration will appear here.
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
