import { useMutation, useQuery } from "@tanstack/react-query";
import financierConfigService from "~/services/financier-config-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { CreateFinancierConfig, UpdateFinancierConfig } from "~/zod/financier-config.zod";
import { queryClient } from "~/lib/query-client";

export const useGetFinancierConfigs = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["financier-configs", apiParams],
		queryFn: () => {
			return financierConfigService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.count(apiParams?.count ?? false)
				.document(apiParams?.document ?? true)
				.pagination(apiParams?.pagination ?? true)
				.getAllFinancierConfigs();
		},
	});
};

export const useGetFinancierConfigById = (
	financierConfigId: string,
	apiParams?: ApiQueryParams,
) => {
	return useQuery({
		queryKey: ["financier-config-by-id", financierConfigId, apiParams],
		queryFn: () => {
			return financierConfigService
				.select(apiParams?.fields || "")
				.getFinancierConfigById(financierConfigId);
		},
		enabled: !!financierConfigId,
	});
};

export const useCreateFinancierConfig = () => {
	return useMutation({
		mutationFn: (data: CreateFinancierConfig) => {
			return financierConfigService.createFinancierConfig(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["financier-configs"] });
		},
	});
};

export const useUpdateFinancierConfig = () => {
	return useMutation({
		mutationFn: ({
			financierConfigId,
			data,
		}: {
			financierConfigId: string;
			data: UpdateFinancierConfig;
		}) => {
			return financierConfigService.updateFinancierConfig(financierConfigId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["financier-configs"] });
		},
	});
};

export const useDeleteFinancierConfig = () => {
	return useMutation({
		mutationFn: (financierConfigId: string) => {
			return financierConfigService.deleteFinancierConfig(financierConfigId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["financier-configs"] });
		},
	});
};
