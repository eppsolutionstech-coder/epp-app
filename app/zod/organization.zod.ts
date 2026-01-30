import { z } from "zod";
import type { Pagination } from "~/types/pagination";

// Branding Schema
export const BrandingSchema = z.object({
	logo: z.string().optional().nullable(),
	background: z.string().optional().nullable(),
	font: z.string().optional().nullable(),
	colors: z
		.object({
			primary: z.string().optional().nullable(),
			secondary: z.string().optional().nullable(),
			accent: z.string().optional().nullable(),
			success: z.string().optional().nullable(),
			warning: z.string().optional().nullable(),
			danger: z.string().optional().nullable(),
			info: z.string().optional().nullable(),
			light: z.string().optional().nullable(),
			dark: z.string().optional().nullable(),
			neutral: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

export type Branding = z.infer<typeof BrandingSchema>;

// Organization User Schema based on example data
const OrganizationUserSchema = z.object({
	id: z.string(),
	userName: z.string(),
	email: z.string(),
	status: z.string(),
	isDeleted: z.boolean(),
	lastLogin: z.string().optional(),
	loginMethod: z.string(),
	role: z
		.object({
			name: z.string(),
		})
		.optional(),
	metadata: z
		.object({
			person: z
				.object({
					personalInfo: z
						.object({
							firstName: z.string(),
							lastName: z.string(),
							avatar: z.string().optional(),
						})
						.optional(),
					contactInfo: z.any().optional(),
				})
				.optional(),
		})
		.optional(),
});

export type OrganizationUser = z.infer<typeof OrganizationUserSchema>;

// Organization Schema
export const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Organization name is required"),
	description: z.string().optional().nullable(),
	code: z.string().min(1, "Code is required"),
	branding: BrandingSchema.optional().nullable(),
	users: z.array(OrganizationUserSchema).optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	isDeleted: z.boolean().default(false),
});

export type Organization = z.infer<typeof OrganizationSchema>;

// Create Organization Schema
export const CreateOrganizationSchema = OrganizationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
	users: true,
}).partial({
	description: true,
	branding: true,
});

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;

// Update Organization Schema
export const UpdateOrganizationSchema = OrganizationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial();

export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;

export type GetAllOrganizations = {
	organizations: Organization[];
	pagination: Pagination;
	count: number;
};
