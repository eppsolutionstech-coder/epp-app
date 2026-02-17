import { useMutation, useQuery } from "@tanstack/react-query";
import deliveryDocumentService from "~/services/delivery-document-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateDeliveryDocument, UpdateDeliveryDocument } from "~/zod/deliveryDocument.zod";
import { queryClient } from "~/lib/query-client";

// GET ALL
export const useGetDeliveryDocuments = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["delivery-documents", apiParams],
		queryFn: () => {
			return deliveryDocumentService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllDeliveryDocuments();
		},
	});
};

// GET BY ID
export const useGetDeliveryDocumentById = (
	deliveryDocumentId: string,
	apiParams?: ApiQueryParams,
) => {
	return useQuery({
		queryKey: ["delivery-document-by-id", deliveryDocumentId, apiParams],
		queryFn: () => {
			return deliveryDocumentService
				.select(apiParams?.fields || "")
				.getDeliveryDocumentById(deliveryDocumentId);
		},
		enabled: !!deliveryDocumentId,
	});
};

// CREATE
export const useCreateDeliveryDocument = () => {
	return useMutation({
		mutationFn: (data: CreateDeliveryDocument) => {
			return deliveryDocumentService.createDeliveryDocument(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery-documents"] });
		},
	});
};

// UPDATE
export const useUpdateDeliveryDocument = () => {
	return useMutation({
		mutationFn: ({
			deliveryDocumentId,
			data,
		}: {
			deliveryDocumentId: string;
			data: UpdateDeliveryDocument;
		}) => {
			return deliveryDocumentService.updateDeliveryDocument(deliveryDocumentId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery-documents"] });
		},
	});
};

// DELETE
export const useDeleteDeliveryDocument = () => {
	return useMutation({
		mutationFn: (deliveryDocumentId: string) => {
			return deliveryDocumentService.deleteDeliveryDocument(deliveryDocumentId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery-documents"] });
		},
	});
};
