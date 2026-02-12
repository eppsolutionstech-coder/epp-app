import { z } from "zod";
import type { Pagination } from "~/types/pagination";
import type { FinancierConfigWithRelation } from "./financier-config.zod";
import type { OrderWithRelation } from "./order.zod";

export const DisbursementStatusEnum = z.enum(["PENDING", "DISBURSED", "FAILED", "CANCELLED"]);
export const ReconciliationStatusEnum = z.enum([
	"PENDING",
	"MATCHED",
	"PARTIAL",
	"DISPUTED",
	"SETTLED",
]);

export type DisbursementStatus = z.infer<typeof DisbursementStatusEnum>;
export type ReconciliationStatus = z.infer<typeof ReconciliationStatusEnum>;

const decimalSchema = z
	.union([z.string().regex(/^-?\d+\.?\d*$/, "Invalid decimal format"), z.number()])
	.transform((val) => (typeof val === "string" ? parseFloat(val) : val));

const positiveDecimalSchema = decimalSchema.refine(
	(value) => value > 0,
	"Amount must be greater than 0",
);

const nonNegativeDecimalSchema = decimalSchema.refine(
	(value) => value >= 0,
	"Amount cannot be negative",
);

export const FinancierDisbursementSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	financingAgreementId: z.string(),
	financierConfigId: z.string(),
	referenceNo: z.string().optional().nullable(),
	amount: positiveDecimalSchema,
	currency: z.string().default("PHP"),
	disbursedAt: z.coerce.date().optional().nullable(),
	expectedAt: z.coerce.date().optional().nullable(),
	status: DisbursementStatusEnum.default("PENDING"),
	reconciliationStatus: ReconciliationStatusEnum.default("PENDING"),
	reconciledAt: z.coerce.date().optional().nullable(),
	reconciledBy: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	metadata: z.record(z.string(), z.any()).optional().nullable(),
	organizationId: z.string().optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type FinancierDisbursement = z.infer<typeof FinancierDisbursementSchema>;

export const CreateFinancierDisbursementSchema = FinancierDisbursementSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	referenceNo: true,
	disbursedAt: true,
	expectedAt: true,
	status: true,
	reconciliationStatus: true,
	reconciledAt: true,
	reconciledBy: true,
	notes: true,
	metadata: true,
	organizationId: true,
});

export type CreateFinancierDisbursement = z.infer<typeof CreateFinancierDisbursementSchema>;

export const UpdateFinancierDisbursementSchema = FinancierDisbursementSchema.omit({
	id: true,
	orderId: true,
	financingAgreementId: true,
	financierConfigId: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateFinancierDisbursement = z.infer<typeof UpdateFinancierDisbursementSchema>;

export const ReconcileFinancierDisbursementSchema = z.object({
	reconciledBy: z.string().min(1, "Reconciled by is required"),
	notes: z.string().optional(),
	status: ReconciliationStatusEnum.default("MATCHED"),
});

export type ReconcileFinancierDisbursement = z.infer<
	typeof ReconcileFinancierDisbursementSchema
>;

export const AdminFinancierSettlementSchema = z.object({
	id: z.string(),
	financierDisbursementId: z.string(),
	financierConfigId: z.string(),
	amount: positiveDecimalSchema,
	currency: z.string().default("PHP"),
	remittedAt: z.coerce.date().optional().nullable(),
	dueAt: z.coerce.date().optional().nullable(),
	referenceNo: z.string().optional().nullable(),
	createdBy: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	metadata: z.record(z.string(), z.any()).optional().nullable(),
	organizationId: z.string().optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type AdminFinancierSettlement = z.infer<typeof AdminFinancierSettlementSchema>;

export const CreateAdminFinancierSettlementSchema = AdminFinancierSettlementSchema.omit({
	id: true,
	financierDisbursementId: true,
	financierConfigId: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	currency: true,
	remittedAt: true,
	dueAt: true,
	referenceNo: true,
	createdBy: true,
	notes: true,
	metadata: true,
	organizationId: true,
});

export type CreateAdminFinancierSettlement = z.infer<typeof CreateAdminFinancierSettlementSchema>;
export type CreateFinancierDisbursementRemittance = CreateAdminFinancierSettlement;

export interface FinancierDisbursementWithRelation extends FinancierDisbursement {
	order?: OrderWithRelation;
	financierConfig?: FinancierConfigWithRelation;
	financingAgreement?: Record<string, unknown>;
	adminSettlements?: AdminFinancierSettlement[];
}

export type GetAllFinancierDisbursements = {
	financierDisbursements: FinancierDisbursementWithRelation[];
	pagination?: Pagination;
	count?: number;
};

export const FinancierDisbursementRemittanceCreateResponseSchema = z.object({
	remittance: AdminFinancierSettlementSchema,
	summary: z.object({
		disbursementId: z.string(),
		disbursementAmount: nonNegativeDecimalSchema,
		totalRemitted: nonNegativeDecimalSchema,
		outstanding: nonNegativeDecimalSchema,
		reconciliationStatus: ReconciliationStatusEnum,
	}),
});

export type FinancierDisbursementRemittanceCreateResponse = z.infer<
	typeof FinancierDisbursementRemittanceCreateResponseSchema
>;

export const FinancierDisbursementRemittancesResponseSchema = z.object({
	disbursement: z.object({
		id: z.string(),
		orderId: z.string(),
		financierConfigId: z.string(),
		amount: nonNegativeDecimalSchema,
	}),
	summary: z.object({
		remittanceCount: z.number().int().nonnegative(),
		totalRemitted: nonNegativeDecimalSchema,
		outstanding: nonNegativeDecimalSchema,
		isOverpaid: z.boolean(),
	}),
	remittances: z.array(AdminFinancierSettlementSchema),
});

export type FinancierDisbursementRemittancesResponse = z.infer<
	typeof FinancierDisbursementRemittancesResponseSchema
>;

const FinancierDisbursementLedgerBreakdownSchema = z.object({
	totalPrice: decimalSchema,
	totalAmount: decimalSchema,
	principalAmount: decimalSchema,
	serviceFee: decimalSchema,
	disbursedPrincipal: decimalSchema,
	installmentIncome: decimalSchema,
	installmentCount: z.number().int().optional().nullable(),
	installmentAmount: decimalSchema.optional().nullable(),
});

export const FinancierDisbursementLedgerEntrySchema = FinancierDisbursementSchema.extend({
	order: z
		.object({
			orderNumber: z.string().optional().nullable(),
			subtotal: decimalSchema.optional().nullable(),
			discount: decimalSchema.optional().nullable(),
			pointsUsed: decimalSchema.optional().nullable(),
			total: decimalSchema.optional().nullable(),
		})
		.optional()
		.nullable(),
	financingAgreement: z
		.object({
			principalAmount: decimalSchema.optional().nullable(),
			totalPayable: decimalSchema.optional().nullable(),
			interestRate: decimalSchema.optional().nullable(),
			installmentCount: z.number().int().optional().nullable(),
			installmentAmount: decimalSchema.optional().nullable(),
		})
		.optional()
		.nullable(),
	breakdown: FinancierDisbursementLedgerBreakdownSchema,
});

export type FinancierDisbursementLedgerEntry = z.infer<
	typeof FinancierDisbursementLedgerEntrySchema
>;

export const FinancierDisbursementLedgerSchema = z.object({
	financierConfigId: z.string(),
	summary: z.object({
		totalEntries: z.number().int().nonnegative(),
		totalAmount: decimalSchema,
		totalDisbursed: decimalSchema,
		totalPending: decimalSchema,
		totalFailedOrCancelled: decimalSchema,
		totalReconciled: decimalSchema,
		outstanding: decimalSchema,
		totalDisbursedPrincipal: decimalSchema,
		totalInstallmentIncome: decimalSchema,
	}),
	entries: z.array(FinancierDisbursementLedgerEntrySchema),
});

export type FinancierDisbursementLedger = z.infer<typeof FinancierDisbursementLedgerSchema>;

export const FinancierDisbursementSoaViewEnum = z.enum(["ADMIN_TO_FINANCIER", "FINANCIER"]);
export type FinancierDisbursementSoaView = z.infer<typeof FinancierDisbursementSoaViewEnum>;

export const FinancierDisbursementSoaEntrySchema = z.object({
	date: z.coerce.date(),
	description: z.string(),
	debit: decimalSchema,
	credit: decimalSchema,
	balance: decimalSchema,
	eventType: z.enum(["LOAN", "PAYMENT"]),
	disbursementId: z.string(),
	orderNumber: z.string().optional().nullable(),
	status: DisbursementStatusEnum,
	reconciliationStatus: ReconciliationStatusEnum,
	referenceNo: z.string().optional().nullable(),
});

export type FinancierDisbursementSoaEntry = z.infer<typeof FinancierDisbursementSoaEntrySchema>;

export const FinancierDisbursementSoaSchema = z.object({
	financierConfigId: z.string().optional().nullable(),
	view: FinancierDisbursementSoaViewEnum,
	summary: z.object({
		totalEntries: z.number().int().nonnegative(),
		totalDebit: decimalSchema,
		totalCredit: decimalSchema,
		outstandingBalance: decimalSchema,
	}),
	entries: z.array(FinancierDisbursementSoaEntrySchema),
});

export type FinancierDisbursementSoa = z.infer<typeof FinancierDisbursementSoaSchema>;
