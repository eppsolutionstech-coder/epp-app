import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "~/hooks/use-auth";
import { toast } from "sonner";

interface OrderApprovalsCardProps {
	approvals: Array<{
		id: string;
		approvalLevel: number;
		approverRole: string;
		approverId: string;
		approverName: string;
		approverEmail: string;
		status: string;
	}>;
}

export function OrderApprovalsCard({ approvals = [] }: OrderApprovalsCardProps) {
	const { user } = useAuth();
	const sortedApprovals = [...approvals].sort((a, b) => a.approvalLevel - b.approvalLevel);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-500 hover:bg-yellow-600";
			case "APPROVED":
				return "bg-emerald-500 hover:bg-emerald-600";
			case "REJECTED":
				return "bg-red-500 hover:bg-red-600";
			default:
				return "bg-gray-500 hover:bg-gray-600";
		}
	};

	const handleAction = (action: "approve" | "decline", approvalId: string) => {
		// Placeholder for action logic
		toast.success(`Order ${action}d successfully`);
	};

	if (approvals.length === 0) {
		return null;
	}

	return (
		<Card className="rounded-xl border-none shadow-sm bg-card ring-1 ring-border/50">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<ShieldCheck className="h-4 w-4" />
					Approval Chain
				</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4">
				{sortedApprovals.map((approval) => {
					const isCurrentUserApprover = user?.id === approval.approverId;
					const canApprove = isCurrentUserApprover && approval.status === "PENDING";

					return (
						<div
							key={approval.id}
							className={cn(
								"flex flex-col gap-3 p-3 rounded-lg border",
								canApprove
									? "bg-primary/5 border-primary/20"
									: "bg-muted/20 border-border",
							)}>
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-start gap-3">
									<Avatar className="h-8 w-8 mt-0.5">
										<AvatarFallback className="text-xs bg-primary/10 text-primary">
											{approval.approverName ? (
												approval.approverName
													.split(" ")
													.map((n) => n[0])
													.join("")
													.substring(0, 2)
													.toUpperCase()
											) : (
												<User className="h-4 w-4" />
											)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium leading-none">
											{approval.approverRole.replace(/_/g, " ")}
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											{approval.approverName}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{approval.approverEmail}
										</p>
									</div>
								</div>
								<Badge
									className={cn(
										"text-[10px] px-2 py-0.5 h-5 shadow-none",
										getStatusColor(approval.status),
										"border-none text-white whitespace-nowrap",
									)}>
									{approval.status}
								</Badge>
							</div>

							{canApprove && (
								<div className="flex items-center gap-2 pt-1">
									<Button
										size="sm"
										variant="outline"
										className="h-8 flex-1 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
										onClick={() => handleAction("decline", approval.id)}>
										<X className="h-3.5 w-3.5" />
										Decline
									</Button>
									<Button
										size="sm"
										className="h-8 flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
										onClick={() => handleAction("approve", approval.id)}>
										<Check className="h-3.5 w-3.5" />
										Approve
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
