import { z } from "zod";
import { ObjectIdSchema, PaginationSchema } from "./common.zod";

export const DeliveryDocumentTypeEnum = z.enum(["DELIVERY_ORDER", "DELIVERY_RECEIPT"]);
export const DeliveryTransferStageEnum = z.enum(["VENDOR_TO_ADMIN", "ADMIN_TO_CLIENT"]);

const DeliveryDocumentItemSchema = z.object({
	itemId: z.string().optional().nullable(),
	sku: z.string(),
	description: z.string().optional().nullable(),
	quantity: z.number().int().positive(),
});

export const DeliveryDocumentSchema = z.object({
	id: ObjectIdSchema,
	organizationId: ObjectIdSchema.optional().nullable(),
	documentType: DeliveryDocumentTypeEnum,
	transferStage: DeliveryTransferStageEnum,
	documentNumber: z.string(),
	documentDate: z.coerce.date(),
	documentTime: z.coerce.date().optional().nullable(),
	correspondingDocumentId: ObjectIdSchema.optional().nullable(),
	purchaseOrderId: ObjectIdSchema.optional().nullable(),
	orderId: ObjectIdSchema.optional().nullable(),
	supplierId: ObjectIdSchema.optional().nullable(),
	fromLocation: z.string().optional().nullable(),
	toName: z.string().optional().nullable(),
	toAddress: z.string().optional().nullable(),
	clientUserId: ObjectIdSchema.optional().nullable(),
	carrierInfo: z.string().optional().nullable(),
	trackingNumber: z.string().optional().nullable(),
	expectedDeliveryDate: z.coerce.date().optional().nullable(),
	expectedDeliveryTime: z.string().optional().nullable(),
	internalDeliveryPersonnel: z.string().optional().nullable(),
	receiverName: z.string().optional().nullable(),
	receiverSignature: z.string().optional().nullable(),
	conditionOfGoods: z.string().optional().nullable(),
	items: z.array(DeliveryDocumentItemSchema),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type DeliveryDocument = z.infer<typeof DeliveryDocumentSchema>;

export const CreateDeliveryDocumentSchema = z.object({
	documentType: DeliveryDocumentTypeEnum,
	transferStage: DeliveryTransferStageEnum,
	documentNumber: z.string().min(1),
	documentDate: z.coerce.date(),
	documentTime: z.coerce.date().optional().nullable(),
	correspondingDocumentId: ObjectIdSchema.optional().nullable(),
	purchaseOrderId: ObjectIdSchema.optional().nullable(),
	orderId: ObjectIdSchema.optional().nullable(),
	supplierId: ObjectIdSchema.optional().nullable(),
	fromLocation: z.string().optional().nullable(),
	toName: z.string().optional().nullable(),
	toAddress: z.string().optional().nullable(),
	clientUserId: ObjectIdSchema.optional().nullable(),
	carrierInfo: z.string().optional().nullable(),
	trackingNumber: z.string().optional().nullable(),
	expectedDeliveryDate: z.coerce.date().optional().nullable(),
	expectedDeliveryTime: z.string().optional().nullable(),
	internalDeliveryPersonnel: z.string().optional().nullable(),
	receiverName: z.string().optional().nullable(),
	receiverSignature: z.string().optional().nullable(),
	conditionOfGoods: z.string().optional().nullable(),
	items: z.array(DeliveryDocumentItemSchema).default([]),
	organizationId: ObjectIdSchema.optional().nullable(),
});

export type CreateDeliveryDocument = z.infer<typeof CreateDeliveryDocumentSchema>;

export const UpdateDeliveryDocumentSchema = z
	.object({
		documentTime: z.coerce.date().optional().nullable(),
		receiverName: z.string().optional().nullable(),
		receiverSignature: z.string().optional().nullable(),
		conditionOfGoods: z.string().optional().nullable(),
		items: z.array(DeliveryDocumentItemSchema).optional(),
	})
	.partial();

export type UpdateDeliveryDocument = z.infer<typeof UpdateDeliveryDocumentSchema>;

export type GetAllDeliveryDocuments = {
	deliveryDocuments: DeliveryDocument[];
	pagination: z.infer<typeof PaginationSchema>;
	count: number;
};

export type CreateDOToAdminResponse = {
	deliveryOrder: DeliveryDocument;
};

export const CreateDOToClientSchema = z.object({
	trackingNumber: z.string().optional().nullable(),
	expectedDeliveryDate: z.coerce.date().optional().nullable(),
	expectedDeliveryTime: z.string().optional().nullable(),
	internalDeliveryPersonnel: z.string().optional().nullable(),
	carrierInfo: z.string().optional().nullable(),
	toName: z.string().optional().nullable(),
	toAddress: z.string().optional().nullable(),
	clientUserId: ObjectIdSchema.optional().nullable(),
});

export type CreateDOToClient = z.infer<typeof CreateDOToClientSchema>;

export type CreateDOToClientResponse = {
	deliveryOrder: DeliveryDocument;
};

export const CreateDRFromSupplierSchema = z.object({
	receiverName: z.string().optional().nullable(),
	receiverSignature: z.string().optional().nullable(),
	conditionOfGoods: z.string().optional().nullable(),
});

export type CreateDRFromSupplier = z.infer<typeof CreateDRFromSupplierSchema>;

export type CreateDRFromSupplierResponse = {
	deliveryReceipt: DeliveryDocument;
	documentNumber: string;
};
