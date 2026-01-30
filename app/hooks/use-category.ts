import { useMutation, useQuery } from "@tanstack/react-query";
import categoryService from "~/services/category-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetCategories = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["categories", apiParams],
		queryFn: () => {
			return categoryService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllCategories();
		},
	});
};

export const useGetCategoryById = (categoryId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["category-by-id", categoryId, apiParams],
		queryFn: () => {
			return categoryService.select(apiParams?.fields || "").getCategoryById(categoryId);
		},
		enabled: !!categoryId,
	});
};

export const useCreateCategory = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return categoryService.createCategory(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};

export const useUpdateCategory = () => {
	return useMutation({
		mutationFn: ({ categoryId, data }: { categoryId: string; data: object | FormData }) => {
			return categoryService.updateCategory(categoryId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};

export const useDeleteCategory = () => {
	return useMutation({
		mutationFn: (categoryId: string) => {
			return categoryService.deleteCategory(categoryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};
