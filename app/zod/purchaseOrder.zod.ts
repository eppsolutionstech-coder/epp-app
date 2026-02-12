import { z } from "zod";
import type { OrderWithRelation } from "./order.zod";
import type { supplierWithRelations } from "./supplier.zod";
import type { Pagination } from "~/types/pagination";

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

const RequisitionerSchema = z.object({
	name: z.string(),
	designation: z.string().optional().nullable(),
	department: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
});

export const PurchaseOrderSchema = z.object({
	id: z.string(),
	poNumber: z.string(),
	orderId: z.string(),
	supplierId: z.string(),
	status: PurchaseOrderStatusEnum,
	items: z.array(PurchaseOrderItemSchema).optional().nullable(),
	leadTime: z.number().int().min(0).optional().nullable(),
	availability: z.string().optional().nullable(),
	delivery: z.string().optional().nullable(),
	pdc: z.string().optional().nullable(),
	requisitioner: RequisitionerSchema.optional().nullable(),
	contactName: z.string().optional().nullable(),
	contactDesignation: z.string().optional().nullable(),
	contactDepartment: z.string().optional().nullable(),
	contactNumber: z.string().optional().nullable(),
	contactMobile: z.string().optional().nullable(),
	contactEmail: z.string().optional().nullable(),
	approvedBy: z.string().optional().nullable(),
	approvedAt: z.coerce.date().optional().nullable(),
	sentToSupplierAt: z.coerce.date().optional().nullable(),
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

export interface PurchaseOrderWithRelations extends PurchaseOrder {
	order: OrderWithRelation;
	supplier: supplierWithRelations;
}

export type GetAllPurchaseOrders = {
	purchaseOrders: PurchaseOrderWithRelations[];
	pagination: Pagination;
	count: number;
};
