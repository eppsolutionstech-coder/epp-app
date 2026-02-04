import { z } from "zod";

export const PurchaseOrderStatusEnum = z.enum([
	"PENDING",
	"APPROVED",
	"SENT",
	"CONFIRMED",
	"SHIPPED",
	"RECEIVED",
	"CANCELLED",
]);

const PurchaseOrderItemSchema = z.object({
	itemId: z.string().optional().nullable(),
	sku: z.string(),
	description: z.string().optional().nullable(),
	quantity: z.number().int().positive(),
	unitPrice: z.number().optional().nullable(),
});

export const PurchaseOrderSchema = z.object({
	id: z.string(),
	poNumber: z.string(),
	orderId: z.string(),
	supplierId: z.string(),
	status: PurchaseOrderStatusEnum,
	items: z.array(PurchaseOrderItemSchema).optional().nullable(),
	approvedBy: z.string().optional().nullable(),
	approvedAt: z.coerce.date().optional().nullable(),
	sentTosupplierAt: z.coerce.date().optional().nullable(),
	notes: z.string().optional().nullable(),
	organizationId: z.string().optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

export const CreatePurchaseOrderSchema = PurchaseOrderSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).extend({
	poNumber: z.string().optional(),
	organizationId: z.string().optional().nullable(),
});

export type CreatePurchaseOrder = z.infer<typeof CreatePurchaseOrderSchema>;

export const UpdatePurchaseOrderSchema = PurchaseOrderSchema.omit({
	id: true,
	poNumber: true,
	orderId: true,
	supplierId: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdatePurchaseOrder = z.infer<typeof UpdatePurchaseOrderSchema>;

