import { z } from "zod";

export const ApproverRoleEnum = z.enum(["MANAGER", "HR", "FINANCE", "DEPARTMENT_HEAD", "ADMIN"]);

// Number schema helper
const numberSchema = z
	.union([z.string().regex(/^\d+\.?\d*$/, "Invalid number format"), z.number()])
	.transform((val) => {
		if (typeof val === "string") {
			return parseFloat(val);
		}
		return val;
	});

// ApprovalType Schema (full, including ID)
export const ApprovalTypeSchema = z.object({
	id: z.string(),
	role: ApproverRoleEnum,
	description: z.string().optional().nullable(),
	isRequired: z.boolean().default(true),
	autoApproveUnder: numberSchema.optional().nullable(),
	timeoutDays: z.number().int().positive("Timeout days must be positive").optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ApprovalType = z.infer<typeof ApprovalTypeSchema>;

// Create ApprovalType Schema (excluding ID, createdAt, updatedAt)
export const CreateApprovalTypeSchema = ApprovalTypeSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	isRequired: true,
	autoApproveUnder: true,
	timeoutDays: true,
});

export type CreateApprovalType = z.infer<typeof CreateApprovalTypeSchema>;

// Update ApprovalType Schema (partial, excluding immutable fields)
export const UpdateApprovalTypeSchema = ApprovalTypeSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateApprovalType = z.infer<typeof UpdateApprovalTypeSchema>;
