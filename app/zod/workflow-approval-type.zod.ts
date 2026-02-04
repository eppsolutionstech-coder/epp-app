import { z } from "zod";
import type { ApprovalType } from "./approval-type.zod";
import type { ApprovalWorkflow } from "./approval-workflow.zod";
import type { Pagination } from "~/types/pagination";

// Note: This matches the table name in the DB usually, but for internal naming consistency:
export const WorkflowApprovalTypeSchema = z.object({
	id: z.string(),
	workflowId: z.string().min(1, "Workflow ID is required"),
	approvalTypeId: z.string().min(1, "Approval Type ID is required"),
	level: z.number().int().positive("Level must be positive"),
	approverId: z.string().optional().nullable(),
	approverName: z.string().optional().nullable(),
	approverEmail: z.string().email("Invalid email format").optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type WorkflowApprovalType = z.infer<typeof WorkflowApprovalTypeSchema>;

export const CreateWorkflowApprovalTypeSchema = WorkflowApprovalTypeSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateWorkflowApprovalType = z.infer<typeof CreateWorkflowApprovalTypeSchema>;

export const UpdateWorkflowApprovalTypeSchema = WorkflowApprovalTypeSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateWorkflowApprovalType = z.infer<typeof UpdateWorkflowApprovalTypeSchema>;

export interface WorkflowApprovalTypeWithRelation extends WorkflowApprovalType {
	approvalType: ApprovalType;
	workflow: ApprovalWorkflow;
}

export interface GetAllWorkflowApprovalTypes {
	workflowApprovalTypes: WorkflowApprovalTypeWithRelation[];
	pagination: Pagination;
	count: number;
}
