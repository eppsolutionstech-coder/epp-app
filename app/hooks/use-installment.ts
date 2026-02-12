import { useMutation, useQuery } from "@tanstack/react-query";
import installmentService from "~/services/installment-service";
import type { ApiQueryParams } from "~/services/api-service";
import type {
	CreateInstallment,
	UpdateInstallment,
	PayInstallmentPayload,
} from "~/zod/installment.zod";
import { queryClient } from "~/lib/query-client";

export const useGetInstallments = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["installments", apiParams],
		queryFn: () => {
			return installmentService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllInstallments();
		},
	});
};

export const useGetInstallmentById = (installmentId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["installment-by-id", installmentId, apiParams],
		queryFn: () => {
			return installmentService
				.select(apiParams?.fields || "")
				.getInstallmentById(installmentId);
		},
		enabled: !!installmentId,
	});
};

export const useCreateInstallment = () => {
	return useMutation({
		mutationFn: (data: CreateInstallment | FormData) => {
			return installmentService.createInstallment(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["installments"] });
		},
	});
};

export const useUpdateInstallment = () => {
	return useMutation({
		mutationFn: ({
			installmentId,
			data,
		}: {
			installmentId: string;
			data: UpdateInstallment | FormData;
		}) => {
			return installmentService.updateInstallment({ installmentId, data });
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["installments"] });
			queryClient.invalidateQueries({
				queryKey: ["installment-by-id", variables.installmentId],
			});
		},
	});
};

export const useDeleteInstallment = () => {
	return useMutation({
		mutationFn: (installmentId: string) => {
			return installmentService.deleteInstallment(installmentId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["installments"] });
		},
	});
};

export const useGetInstallmentLedger = (employeeId: string, orderId: string) => {
	return useQuery({
		queryKey: ["installment-ledger", employeeId, orderId],
		queryFn: () => {
			return installmentService.getInstallmentLedger({ employeeId, orderId });
		},
		enabled: !!employeeId && !!orderId,
	});
};

export const useGetInstallmentSummaryByOrder = (orderId: string) => {
	return useQuery({
		queryKey: ["installment-summary-by-order", orderId],
		queryFn: () => {
			return installmentService.getInstallmentSummaryByOrder(orderId);
		},
		enabled: !!orderId,
	});
};

export const usePayInstallment = () => {
	return useMutation({
		mutationFn: ({
			installmentId,
			data,
		}: {
			installmentId: string;
			data: PayInstallmentPayload;
		}) => {
			return installmentService.payInstallment({ installmentId, data });
		},
		onSuccess: (response, variables) => {
			queryClient.invalidateQueries({ queryKey: ["installments"] });
			queryClient.invalidateQueries({
				queryKey: ["installment-by-id", variables.installmentId],
			});
			queryClient.invalidateQueries({ queryKey: ["installment-ledger"] });

			const orderId = response?.installment?.orderId;
			if (orderId) {
				queryClient.invalidateQueries({ queryKey: ["installment-summary-by-order", orderId] });
			}
		},
	});
};
