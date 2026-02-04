import { z } from "zod";
import type { Pagination } from "~/types/pagination";
import type { ItemWithRelation } from "./item.zod";

// supplier Schema (full, including ID)
export const supplierschema = z.object({
	id: z.string(),
	name: z.string().min(1, "supplier name is required"),
	code: z.string().min(1, "supplier code is required"),
	description: z.string().optional().nullable(),
	contactName: z.string().optional().nullable(),
	email: z.string().email("Invalid email format").optional().nullable(),
	phone: z.string().optional().nullable(),
	website: z.string().url("Invalid URL format").optional().nullable(),
	isActive: z.boolean().default(true),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type supplier = z.infer<typeof supplierschema>;

// Create supplier Schema (excluding ID, createdAt, updatedAt)
export const Createsupplierschema = supplierschema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	contactName: true,
	email: true,
	phone: true,
	website: true,
	isActive: true,
});

export type Createsupplier = z.infer<typeof Createsupplierschema>;

// Update supplier Schema (partial, excluding immutable fields)
export const Updatesupplierschema = supplierschema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type Updatesupplier = z.infer<typeof Updatesupplierschema>;

export interface supplierWithRelations extends supplier {
	items: ItemWithRelation[];
}

export type GetAllsuppliers = {
	suppliers: supplierWithRelations[];
	pagination: Pagination;
	count: number;
};

