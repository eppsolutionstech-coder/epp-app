import { z } from "zod";
import type { Pagination } from "~/types/pagination";

export const ApprovalWorkflowSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().nullable(),
	isActive: z.boolean().default(true),
	minOrderAmount: z.number().optional().nullable(),
	maxOrderAmount: z.number().optional().nullable(),
	requiresInstallment: z.boolean().default(false),
	workflowLevels: z.any().optional(), // Using any temporarily to avoid circular deps or complex type setup, will refine
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ApprovalWorkflow = z.infer<typeof ApprovalWorkflowSchema>;

export const CreateApprovalWorkflowSchema = ApprovalWorkflowSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	isActive: true,
	minOrderAmount: true,
	maxOrderAmount: true,
	requiresInstallment: true,
});

export type CreateApprovalWorkflow = z.infer<typeof CreateApprovalWorkflowSchema>;

export const UpdateApprovalWorkflowSchema = ApprovalWorkflowSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateApprovalWorkflow = z.infer<typeof UpdateApprovalWorkflowSchema>;

export type GetAllApprovalWorkflows = {
	approvalWorkflows: ApprovalWorkflow[];
	pagination: Pagination;
	count: number;
};
