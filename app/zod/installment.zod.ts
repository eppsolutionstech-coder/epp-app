import { z } from "zod";
import type { Pagination } from "~/types/pagination";

export const InstallmentStatusEnum = z.enum([
	"PENDING",
	"SCHEDULED",
	"DEDUCTED",
	"FAILED",
	"CANCELLED",
	"REFUNDED",
]);

export type InstallmentStatus = z.infer<typeof InstallmentStatusEnum>;

// Decimal helper for numeric conversion
const decimalSchema = z
	.union([z.string().regex(/^-?\d+\.?\d*$/, "Invalid decimal format"), z.number()])
	.transform((val) => (typeof val === "string" ? parseFloat(val) : val));

// Installment Schema (full, including ID)
export const InstallmentSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	financingAgreementId: z.string().optional().nullable(),
	installmentNumber: z.number().int().min(1, "installmentNumber must be at least 1"),
	amount: decimalSchema,
	principalAmount: decimalSchema.optional().nullable(),
	interestAmount: decimalSchema.optional().nullable(),
	status: InstallmentStatusEnum.default("PENDING"),
	cutOffDate: z.coerce.date(),
	scheduledDate: z.coerce.date(),
	deductedDate: z.coerce.date().optional().nullable(),
	payrollBatchId: z.string().optional().nullable(),
	deductionReference: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Installment = z.infer<typeof InstallmentSchema>;

// Create Installment Schema (excluding ID, createdAt, updatedAt)
export const CreateInstallmentSchema = InstallmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
	.partial({
		deductedDate: true,
		payrollBatchId: true,
		deductionReference: true,
		notes: true,
		status: true,
		financingAgreementId: true,
		principalAmount: true,
		interestAmount: true,
	})
	.extend({
		organizationId: z.string().optional().nullable(),
	});

export type CreateInstallment = z.infer<typeof CreateInstallmentSchema>;

// Update Installment Schema (partial, excluding immutable fields)
export const UpdateInstallmentSchema = InstallmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateInstallment = z.infer<typeof UpdateInstallmentSchema>;

export type InstallmentWithRelation = Installment;

export type GetAllInstallments = {
	installments: InstallmentWithRelation[];
	pagination?: Pagination;
	count?: number;
};

export const PayInstallmentPayloadSchema = z.object({
	payrollBatchId: z.string().optional(),
	deductionReference: z.string().optional(),
});

export type PayInstallmentPayload = z.infer<typeof PayInstallmentPayloadSchema>;

export const InstallmentOrderSummarySchema = z.object({
	totalInstallments: z.number(),
	paidCount: z.number(),
	pendingCount: z.number(),
	failedCount: z.number(),
	totalAmount: z.number(),
	paidAmount: z.number(),
	remainingAmount: z.number(),
	installments: z.array(InstallmentSchema),
});

export type InstallmentOrderSummary = z.infer<typeof InstallmentOrderSummarySchema>;

export const InstallmentLedgerEntrySchema = z.object({
	date: z.coerce.date(),
	description: z.string(),
	debit: z.number(),
	credit: z.number(),
	balance: z.number(),
	eventType: z.enum(["LOAN", "PAYMENT"]),
	orderId: z.string(),
	orderNumber: z.string(),
	installmentId: z.string().nullable(),
	installmentNumber: z.number().nullable(),
	installmentStatus: z.string().nullable(),
	referenceNo: z.string().nullable(),
});

export type InstallmentLedgerEntry = z.infer<typeof InstallmentLedgerEntrySchema>;

export const InstallmentLedgerSchema = z.object({
	employeeId: z.string(),
	orderId: z.string().optional(),
	summary: z.object({
		totalOrders: z.number(),
		totalEntries: z.number(),
		totalDebit: z.number(),
		totalCredit: z.number(),
		outstandingBalance: z.number(),
	}),
	entries: z.array(InstallmentLedgerEntrySchema),
});

export type InstallmentLedger = z.infer<typeof InstallmentLedgerSchema>;
