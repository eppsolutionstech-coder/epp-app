import { useMutation, useQuery } from "@tanstack/react-query";
import financierDisbursementService, {
	type LedgerRole,
} from "~/services/financier-disbursement-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import type {
	CreateFinancierDisbursement,
	UpdateFinancierDisbursement,
	ReconcileFinancierDisbursement,
	CreateFinancierDisbursementRemittance,
} from "~/zod/financier-disbursement.zod";

export const useGetFinancierDisbursements = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["financier-disbursements", apiParams],
		queryFn: () => {
			return financierDisbursementService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllFinancierDisbursements();
		},
	});
};

export const useGetFinancierDisbursementById = (
	financierDisbursementId: string,
	apiParams?: ApiQueryParams,
) => {
	return useQuery({
		queryKey: ["financier-disbursement-by-id", financierDisbursementId, apiParams],
		queryFn: () => {
			return financierDisbursementService
				.select(apiParams?.fields || "")
				.getFinancierDisbursementById(financierDisbursementId);
		},
		enabled: !!financierDisbursementId,
	});
};

export const useCreateFinancierDisbursement = () => {
	return useMutation({
		mutationFn: (data: CreateFinancierDisbursement | FormData) => {
			return financierDisbursementService.createFinancierDisbursement(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["financier-disbursements"] });
		},
	});
};

export const useUpdateFinancierDisbursement = () => {
	return useMutation({
		mutationFn: ({
			financierDisbursementId,
			data,
		}: {
			financierDisbursementId: string;
			data: UpdateFinancierDisbursement | FormData;
		}) => {
			return financierDisbursementService.updateFinancierDisbursement({
				financierDisbursementId,
				data,
			});
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["financier-disbursements"] });
			queryClient.invalidateQueries({
				queryKey: ["financier-disbursement-by-id", variables.financierDisbursementId],
			});
		},
	});
};

export const useDeleteFinancierDisbursement = () => {
	return useMutation({
		mutationFn: (financierDisbursementId: string) => {
			return financierDisbursementService.deleteFinancierDisbursement(
				financierDisbursementId,
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["financier-disbursements"] });
		},
	});
};

export const useGetLedger = (
	financierConfigId: string,
	role: LedgerRole = "financier",
) => {
	return useQuery({
		queryKey: ["ledger", role, financierConfigId],
		queryFn: () => {
			return financierDisbursementService.getLedger(financierConfigId, role);
		},
		enabled: !!financierConfigId,
	});
};

// export const useGetFinancierDisbursementRemittances = (financierDisbursementId: string) => {
// 	return useQuery({
// 		queryKey: ["financier-disbursement-remittances", financierDisbursementId],
// 		queryFn: () => {
// 			return financierDisbursementService.getFinancierDisbursementRemittances(
// 				financierDisbursementId,
// 			);
// 		},
// 		enabled: !!financierDisbursementId,
// 	});
// };

// export const useGetFinancierDisbursementLedger = (financierConfigId: string) => {
// 	return useQuery({
// 		queryKey: ["financier-disbursement-ledger", financierConfigId],
// 		queryFn: () => {
// 			return financierDisbursementService.getFinancierDisbursementLedger(
// 				financierConfigId,
// 			);
// 		},
// 		enabled: !!financierConfigId,
// 	});
// };

// export const useGetAdminToFinancierSoa = (financierConfigId?: string) => {
// 	return useQuery({
// 		queryKey: ["financier-disbursement-admin-soa", financierConfigId || "all"],
// 		queryFn: () => {
// 			return financierDisbursementService.getAdminToFinancierSoa(financierConfigId);
// 		},
// 	});
// };

// export const useGetFinancierSoa = (financierConfigId: string) => {
// 	return useQuery({
// 		queryKey: ["financier-disbursement-financier-soa", financierConfigId],
// 		queryFn: () => {
// 			return financierDisbursementService.getFinancierSoa(financierConfigId);
// 		},
// 		enabled: !!financierConfigId,
// 	});
// };

// export const useReconcileFinancierDisbursement = () => {
// 	return useMutation({
// 		mutationFn: ({
// 			financierDisbursementId,
// 			data,
// 		}: {
// 			financierDisbursementId: string;
// 			data: ReconcileFinancierDisbursement;
// 		}) => {
// 			return financierDisbursementService.reconcileFinancierDisbursement({
// 				financierDisbursementId,
// 				data,
// 			});
// 		},
// 		onSuccess: (_data, variables) => {
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursements"] });
// 			queryClient.invalidateQueries({
// 				queryKey: ["financier-disbursement-by-id", variables.financierDisbursementId],
// 			});
// 			queryClient.invalidateQueries({
// 				queryKey: ["financier-disbursement-remittances", variables.financierDisbursementId],
// 			});
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-ledger"] });
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-admin-soa"] });
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-financier-soa"] });
// 		},
// 	});
// };

// export const useCreateFinancierDisbursementRemittance = () => {
// 	return useMutation({
// 		mutationFn: ({
// 			financierDisbursementId,
// 			data,
// 		}: {
// 			financierDisbursementId: string;
// 			data: CreateFinancierDisbursementRemittance;
// 		}) => {
// 			return financierDisbursementService.createFinancierDisbursementRemittance({
// 				financierDisbursementId,
// 				data,
// 			});
// 		},
// 		onSuccess: (_data, variables) => {
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursements"] });
// 			queryClient.invalidateQueries({
// 				queryKey: ["financier-disbursement-by-id", variables.financierDisbursementId],
// 			});
// 			queryClient.invalidateQueries({
// 				queryKey: ["financier-disbursement-remittances", variables.financierDisbursementId],
// 			});
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-ledger"] });
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-admin-soa"] });
// 			queryClient.invalidateQueries({ queryKey: ["financier-disbursement-financier-soa"] });
// 		},
// 	});
// };
