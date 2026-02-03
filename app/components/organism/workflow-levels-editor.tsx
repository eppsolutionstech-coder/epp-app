import { useState } from "react";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useGetApprovalLevels } from "~/hooks/use-approval-level";
import { useCreateWorkflowApprovalLevel } from "~/hooks/use-workflow-approval-level";
import { queryClient } from "~/lib/query-client";
import type { ApprovalWorkflow } from "~/zod/approval-workflow.zod";
import type { ApprovalLevel } from "../../zod/approval-level.zod";
import { useGetUsers } from "~/hooks/use-user";

interface WorkflowLevelsEditorProps {
	workflow: ApprovalWorkflow | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function WorkflowLevelsEditor({ workflow, open, onOpenChange }: WorkflowLevelsEditorProps) {
	const { data: levelsData } = useGetApprovalLevels({ limit: 100 });
	const { mutate: addLevel, isPending } = useCreateWorkflowApprovalLevel();
	const { data: users, isLoading } = useGetUsers({
		fields: "id, userName, email, metadata, role",
	});

	// Cast data to expected type
	const availableLevels =
		(levelsData as { approvalLevels: ApprovalLevel[] })?.approvalLevels || [];

	const [selectedLevelId, setSelectedLevelId] = useState<string>("");
	const [selectedApproverId, setSelectedApproverId] = useState<string>("");
	const [approverName, setApproverName] = useState<string>("");
	const [approverEmail, setApproverEmail] = useState<string>("");

	const handleApproverChange = (id: string) => {
		setSelectedApproverId(id);
		const approverUser = users?.users?.find((u: any) => u.id === id);

		if (approverUser) {
			const personalInfo = approverUser.metadata?.employee?.personalInfo;
			const displayName =
				personalInfo?.firstName && personalInfo?.lastName
					? `${personalInfo.firstName} ${personalInfo.lastName}`
					: approverUser.userName;

			setApproverName(displayName);
			setApproverEmail(approverUser.email);
		}
	};

	if (!workflow) return null;

	const currentLevels = workflow.workflowLevels || [];

	const handleAdd = () => {
		if (!selectedLevelId) return;

		addLevel(
			{
				workflowId: workflow.id,
				approvalLevelId: selectedLevelId,
				level: currentLevels.length + 1,

				approverId: selectedApproverId,
				approverName: approverName,
				approverEmail: approverEmail,
			},
			{
				onSuccess: () => {
					toast.success("Approval level added successfully");
					setSelectedLevelId("");
					setSelectedApproverId("");
					setApproverName("");
					setApproverEmail("");
					// Invalidate workflows query to refresh the list and show the new level
					queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });
				},
				onError: (error) => {
					toast.error(error.message || "Failed to add approval level");
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Manage Approval Levels</DialogTitle>
					<DialogDescription>
						Configure approval levels for <strong>{workflow.name}</strong>. Levels are
						processed in order.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2">
					<div className="flex items-end gap-4">
						<div className="flex-1 space-y-2">
							<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Add Level
							</label>
							<Select value={selectedLevelId} onValueChange={setSelectedLevelId}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an approval level" />
								</SelectTrigger>
								<SelectContent>
									{availableLevels.map((level) => {
										// Handle potentially expanded role object
										const roleName =
											typeof level.role === "object" && level.role !== null
												? (level.role as any).name
												: level.role;
										return (
											<SelectItem key={level.id} value={level.id}>
												{roleName} - {level.description || "No description"}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 space-y-2">
							<Label>Approver</Label>
							<Select value={selectedApproverId} onValueChange={handleApproverChange}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an approver" />
								</SelectTrigger>
								<SelectContent>
									{users?.users?.map((user: any) => {
										const personalInfo = user.metadata?.employee?.personalInfo;
										const displayName =
											personalInfo?.firstName && personalInfo?.lastName
												? `${personalInfo.firstName} ${personalInfo.lastName}`
												: user.userName;
										return (
											<SelectItem key={user.id} value={user.id}>
												<div className="flex flex-col items-start gap-1">
													<span className="font-medium text-sm">
														{displayName}
													</span>
													<span className="text-xs text-muted-foreground">
														{user.email}
													</span>
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex justify-end pt-2">
						<Button
							disabled={
								!selectedLevelId ||
								!selectedApproverId ||
								!approverName ||
								!approverEmail ||
								isPending
							}
							onClick={handleAdd}>
							{isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Plus className="mr-2 h-4 w-4" />
							)}
							Add Level
						</Button>
					</div>

					<div className="space-y-4">
						<h4 className="text-sm font-medium">Current Levels</h4>

						{/* Placeholder for when no levels exist */}
						{currentLevels.length === 0 && (
							<div className="text-center py-8 bg-muted/40 rounded-lg border border-dashed">
								<p className="text-sm text-muted-foreground">
									No approval levels configured for this workflow.
								</p>
							</div>
						)}

						{/* List of levels */}
						<div className="space-y-2">
							{/* We'll display mock data if currentLevels is empty just to show UI */}
							{(currentLevels.length > 0 ? currentLevels : []).map(
								(level: any, index: number) => (
									<div
										key={index}
										className="flex items-center gap-4 p-3 bg-card border rounded-md shadow-sm group">
										<div className="cursor-move text-muted-foreground hover:text-foreground">
											<GripVertical className="h-4 w-4" />
										</div>
										<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
											{index + 1}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<div className="font-medium">
													{level.approverName || "Unknown Approver"}
												</div>
												<Badge variant="secondary" className="text-xs">
													{level.approvalLevel?.role || "Unknown Role"}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground">
												{level.approverEmail || "No email"}
											</div>
											<div className="text-xs text-muted-foreground/80 pt-1">
												{level.approvalLevel?.description}
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="text-muted-foreground hover:text-destructive">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								),
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
