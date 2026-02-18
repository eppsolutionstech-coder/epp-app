import pkg from "lodash";
const { debounce } = pkg;
import { useMemo, useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { ApiQueryParams } from "~/services/api-service";

// Merge URL search params with initial params, giving URL priority only when a value exists
const mergeParams = (
	searchParams: URLSearchParams,
	initialParams: ApiQueryParams,
): ApiQueryParams => ({
	...initialParams,
	query: searchParams.get("search") ?? initialParams.query ?? "",
	filter: [initialParams.filter, searchParams.get("filter")].filter(Boolean).join(","),
	page: parseInt(searchParams.get("page") ?? "1", 10),
	sort: searchParams.get("sort") || initialParams.sort || "",
	order: (searchParams.get("order") as "asc" | "desc") || initialParams.order || "asc",
});

export const useApiParams = (initialParams: ApiQueryParams = {}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [apiParams, setApiParams] = useState<ApiQueryParams>(() =>
		mergeParams(searchParams, initialParams),
	);
	const [searchTerm, setSearchTerm] = useState(apiParams.query ?? "");

	// Sync state when URL changes (e.g. browser back/forward, external filter changes)
	useEffect(() => {
		setApiParams(mergeParams(searchParams, initialParams));
		setSearchTerm(searchParams.get("search") ?? "");
	}, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

	const updateSearchParam = (key: string, value: string) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				value ? next.set(key, value) : next.delete(key);
				return next;
			},
			{ replace: true },
		);
	};

	const debouncedUpdateSearch = useMemo(
		() =>
			debounce((value: string) => {
				setApiParams((prev) => ({ ...prev, query: value, page: 1 }));
				updateSearchParam("search", value);
			}, 500),
		[setSearchParams],
	);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		debouncedUpdateSearch(value);
	};

	const handlePageChange = (page: number) => {
		setApiParams((prev) => ({ ...prev, page }));
		updateSearchParam("page", page.toString());
	};

	const handleFilterChange = (filter: string) => {
		setApiParams((prev) => ({ ...prev, filter, page: 1 }));
		updateSearchParam("filter", filter);
	};

	const incrementPage = () => {
		setApiParams((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }));
	};

	return {
		apiParams,
		searchTerm,
		handleSearchChange,
		handlePageChange,
		handleFilterChange,
		incrementPage,
	};
};
