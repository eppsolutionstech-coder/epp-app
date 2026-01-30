import { useState } from "react";
import { Plus, Layers, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ApprovalWorkflow } from "~/zod/approval-workflow.zod";
import { useGetApprovalWorkflows } from "~/hooks/use-approval-workflow";
import { WorkflowLevelsEditor } from "./workflow-levels-editor";
import { CreateApprovalWorkflowDialog } from "./create-approval-workflow-dialog";
import { ManageApprovalLevelsDialog } from "./manage-approval-levels-dialog";

export function OrganizationApprovalWorkflowsTab() {
	const { data, isLoading } = useGetApprovalWorkflows({
		limit: 100,
		fields: "id, name, description, isActive, minOrderAmount, maxOrderAmount, requiresInstallment, workflowLevels.level, workflowLevels.approvalLevel.role, workflowLevels.approvalLevel.timeoutDays, createdAt, updatedAt",
	});

	const workflows = data?.approvalWorkflows || [];
	const [editingWorkflow, setEditingWorkflow] = useState<ApprovalWorkflow | null>(null);
	const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
	const [isManageLevelsOpen, setIsManageLevelsOpen] = useState(false);

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								Approval Workflows
								<Badge variant="secondary" className="ml-2">
									{workflows.length}
								</Badge>
							</CardTitle>
							<CardDescription className="mt-1.5">
								Manage approval workflows for this organization.
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => setIsManageLevelsOpen(true)}>
								<Settings className="mr-2 h-4 w-4" />
								Manage Levels
							</Button>
							<Button size="sm" onClick={() => setIsCreateWorkflowOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add Workflow
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(3)].map((_, i) => (
								<Card key={i} className="animate-pulse border-dashed shadow-none">
									<CardHeader className="space-y-2">
										<div className="h-5 w-1/2 bg-muted rounded" />
										<div className="h-4 w-3/4 bg-muted rounded" />
									</CardHeader>
									<CardContent>
										<div className="h-20 bg-muted rounded" />
									</CardContent>
								</Card>
							))}
						</div>
					) : workflows.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
							<div className="text-muted-foreground mb-4">
								No approval workflows found.
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsCreateWorkflowOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Create your first workflow
							</Button>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{workflows.map((workflow) => (
								<Card
									key={workflow.id}
									className="flex flex-col bg-muted/40 border-border/60 hover:border-primary/50 hover:bg-muted/60 transition-all shadow-sm">
									<CardHeader>
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-1">
												<CardTitle className="text-base font-semibold leading-none">
													{workflow.name}
												</CardTitle>
												{workflow.description && (
													<CardDescription className="line-clamp-2">
														{workflow.description}
													</CardDescription>
												)}
											</div>
											<Badge
												variant={
													workflow.isActive ? "default" : "secondary"
												}
												className="shrink-0">
												{workflow.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="flex-1 grid gap-4">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<div className="text-muted-foreground text-xs mb-1">
													Min Order
												</div>
												<div className="font-medium font-mono">
													{workflow.minOrderAmount
														? `₱${Number(
																workflow.minOrderAmount,
															).toLocaleString()}`
														: "—"}
												</div>
											</div>
											<div>
												<div className="text-muted-foreground text-xs mb-1">
													Max Order
												</div>
												<div className="font-medium font-mono">
													{workflow.maxOrderAmount
														? `₱${Number(
																workflow.maxOrderAmount,
															).toLocaleString()}`
														: "—"}
												</div>
											</div>
										</div>

										<div>
											<div className="text-muted-foreground text-xs mb-1">
												Installment
											</div>
											<Badge variant="outline" className="font-normal">
												{workflow.requiresInstallment
													? "Required"
													: "Optional"}
											</Badge>
										</div>

										<div className="pt-2 mt-auto border-t text-xs text-muted-foreground flex justify-between items-center">
											<span>
												Created:{" "}
												{new Date(workflow.createdAt).toLocaleDateString()}
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-7 px-2"
												onClick={() => setEditingWorkflow(workflow)}>
												<Layers className="mr-1.5 h-3.5 w-3.5" />
												Levels
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<WorkflowLevelsEditor
				workflow={editingWorkflow}
				open={!!editingWorkflow}
				onOpenChange={(open) => !open && setEditingWorkflow(null)}
			/>
			<CreateApprovalWorkflowDialog
				open={isCreateWorkflowOpen}
				onOpenChange={setIsCreateWorkflowOpen}
			/>
			<ManageApprovalLevelsDialog
				open={isManageLevelsOpen}
				onOpenChange={setIsManageLevelsOpen}
			/>
		</>
	);
}
