import { z } from "zod";
import type { ItemWithRelation } from "./item.zod";
import type { Pagination } from "~/types/pagination";

// Supplier Schema (full, including ID)
export const SupplierSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Supplier name is required"),
	code: z.string().min(1, "Supplier code is required"),
	description: z.string().optional().nullable(),
	contactName: z.string().optional().nullable(),
	email: z.string().email("Invalid email format").optional().nullable(),
	phone: z.string().optional().nullable(),
	website: z.string().url("Invalid URL format").optional().nullable(),
	address: z.string().optional().nullable(),
	isActive: z.boolean().default(true),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

// Create Supplier Schema (excluding ID, createdAt, updatedAt)
export const CreateSupplierSchema = SupplierSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})
	.partial({
		description: true,
		contactName: true,
		email: true,
		phone: true,
		website: true,
		address: true,
		isActive: true,
	})
	.extend({
		organizationId: z.string().optional().nullable(),
	});

export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;

// Update Supplier Schema (partial, excluding immutable fields)
export const UpdateSupplierSchema = SupplierSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateSupplier = z.infer<typeof UpdateSupplierSchema>;

export interface supplierWithRelations extends Supplier {
	items: ItemWithRelation[];
}

export type GetAllsuppliers = {
	suppliers: supplierWithRelations[];
	pagination: Pagination;
	count: number;
};
