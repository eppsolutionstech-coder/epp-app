# API Call Standard

This document outlines the standard pattern for creating API calls in the EPP application. Follow these steps when creating a new API endpoint integration.

---

## Table of Contents

1. [Step 1: Define Endpoints](#step-1-define-endpoints)
2. [Step 2: Create Service File](#step-2-create-service-file)
3. [Step 3: Create React Query Hooks](#step-3-create-react-query-hooks)
4. [Step 4: Create Zod Schema File](#step-4-create-zod-schema-file)

---

## Step 1: Define Endpoints

**File Location:** `app/configs/endpoints.ts`

Add a new endpoint object for your resource in the `API_ENDPOINTS` object.

### Example: ORDER Endpoint

```typescript
ORDER: {
    GET_ALL: "/order",
    GET_BY_ID: "/order/:id",
    CREATE: "/order",
    UPDATE: "/order/:id",
    DELETE: "/order/:id", // Soft delete
},
```

### Naming Convention

- Use **UPPERCASE** for the resource name (e.g., `ORDER`, `PRODUCT`, `USER`)
- Use **UPPERCASE** with underscores for action names (e.g., `GET_ALL`, `GET_BY_ID`, `CREATE`, `UPDATE`, `DELETE`)
- Use `:id` as a placeholder for dynamic route parameters

---

## Step 2: Create Service File

**File Location:** `app/services/{resource}-service.ts`

Create a service class that extends `APIService` and implements methods for each endpoint.

### Example: order-service.ts

```typescript
import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAll{Resource}, {Resource}WithRelation, Create{Resource}, Update{Resource} } from "~/zod/{resource}.zod";

const { RESOURCE } = API_ENDPOINTS;

class {Resource}Service extends APIService {
    getAll{Resource}s = async () => {
        try {
            const response: ApiResponse<GetAll{Resource}> = await apiClient.get(
                `${RESOURCE.GET_ALL}${this.getQueryString()}`,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.data?.errors?.[0]?.message || error.message || "An error has occurred",
            );
        }
    };

    get{Resource}ById = async ({resource}Id: string) => {
        try {
            const response: ApiResponse<{Resource}WithRelation> = await apiClient.get(
                `${RESOURCE.GET_BY_ID.replace(":id", {resource}Id)}${this.getQueryString()}`,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.data?.errors?.[0]?.message || error.message || "An error has occurred",
            );
        }
    };

    create{Resource} = async (data: Create{Resource}) => {
        try {
            const response: ApiResponse<{ {resource}: {Resource}WithRelation }> = await apiClient.post(
                RESOURCE.CREATE,
                data,
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.data?.errors?.[0]?.message || error.message || "An error has occurred",
            );
        }
    };

    update{Resource} = async ({resource}Id: string, data: Update{Resource}) => {
        try {
            const response = await apiClient.patch(RESOURCE.UPDATE.replace(":id", {resource}Id), data);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.data?.errors?.[0]?.message || error.message || "An error has occurred",
            );
        }
    };

    delete{Resource} = async ({resource}Id: string) => {
        try {
            const response = await apiClient.delete(RESOURCE.DELETE.replace(":id", {resource}Id));
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.data?.errors?.[0]?.message || error.message || "An error has occurred",
            );
        }
    };
}

export default new {Resource}Service();
```

### Key Points

- **Extend `APIService`** to inherit query string builder methods (`select`, `search`, `paginate`, `sort`, `filter`, `count`, `document`, `pagination`)
- **Use `apiClient`** for all HTTP requests
- **Type the response** using `ApiResponse<T>` generic
- **Handle errors consistently** with the standard error message extraction
- **Export as singleton** using `export default new {Resource}Service()`

---

## Step 3: Create React Query Hooks

**File Location:** `app/hooks/use-{resource}.ts`

Create React Query hooks for each service method.

### Example: use-order.ts

```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import {resource}Service from "~/services/{resource}-service";
import type { ApiQueryParams } from "~/services/api-service";
import type { Create{Resource}, Update{Resource} } from "~/zod/{resource}.zod";
import { queryClient } from "~/lib/query-client";

// GET ALL
export const useGet{Resource}s = (apiParams?: ApiQueryParams) => {
    return useQuery({
        queryKey: ["{resource}s", apiParams],
        queryFn: () => {
            return {resource}Service
                .select(apiParams?.fields || "")
                .search(apiParams?.query || "")
                .paginate(apiParams?.page || 1, apiParams?.limit || 10)
                .sort(apiParams?.sort, apiParams?.order)
                .filter(apiParams?.filter || "")
                .count(apiParams?.count ?? false)
                .document(apiParams?.document ?? true)
                .pagination(apiParams?.pagination ?? true)
                .getAll{Resource}s();
        },
    });
};

// GET BY ID
export const useGet{Resource}ById = ({resource}Id: string, apiParams?: ApiQueryParams) => {
    return useQuery({
        queryKey: ["{resource}-by-id", {resource}Id, apiParams],
        queryFn: () => {
            return {resource}Service.select(apiParams?.fields || "").get{Resource}ById({resource}Id);
        },
        enabled: !!{resource}Id,
    });
};

// CREATE
export const useCreate{Resource} = () => {
    return useMutation({
        mutationFn: (data: Create{Resource}) => {
            return {resource}Service.create{Resource}(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["{resource}s"] });
        },
    });
};

// UPDATE
export const useUpdate{Resource} = () => {
    return useMutation({
        mutationFn: ({ {resource}Id, data }: { {resource}Id: string; data: Update{Resource} }) => {
            return {resource}Service.update{Resource}({resource}Id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["{resource}s"] });
        },
    });
};

// DELETE
export const useDelete{Resource} = () => {
    return useMutation({
        mutationFn: ({resource}Id: string) => {
            return {resource}Service.delete{Resource}({resource}Id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["{resource}s"] });
        },
    });
};
```

### Key Points

- **Use `useQuery`** for GET operations
- **Use `useMutation`** for CREATE, UPDATE, DELETE operations
- **Define unique `queryKey`** for cache management
- **Use `apiParams`** to pass query parameters (fields, pagination, sorting, filtering)
- **Invalidate queries on success** using `queryClient.invalidateQueries()`
- **Use `enabled` option** for conditional queries (e.g., `enabled: !!{resource}Id`)

---

## Step 4: Create Zod Schema File

**File Location:** `app/zod/{resource}.zod.ts`

Create a Zod schema file to define and validate types for the resource.

### Template: {resource}.zod.ts

```typescript
import { z } from "zod";

// Base schema for the resource
export const {Resource}Schema = z.object({
    // TODO: Define your schema fields here
    // Example:
    // id: z.string(),
    // name: z.string(),
    // createdAt: z.string().datetime(),
    // updatedAt: z.string().datetime(),
});

// Schema with relations
export const {Resource}WithRelationSchema = {Resource}Schema.extend({
    // TODO: Add relation fields here
    // Example:
    // user: UserSchema.optional(),
    // items: z.array(ItemSchema).optional(),
});

// Schema for GET ALL response
export const GetAll{Resource}sSchema = z.object({
    data: z.array({Resource}WithRelationSchema),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }).optional(),
});

// Schema for CREATE request
export const Create{Resource}Schema = {Resource}Schema.omit({
    // TODO: Omit auto-generated fields
    // Example:
    // id: true,
    // createdAt: true,
    // updatedAt: true,
});

// Schema for UPDATE request
export const Update{Resource}Schema = Create{Resource}Schema.partial();

// Type exports
export type {Resource} = z.infer<typeof {Resource}Schema>;
export type {Resource}WithRelation = z.infer<typeof {Resource}WithRelationSchema>;
export type GetAll{Resource}s = z.infer<typeof GetAll{Resource}sSchema>;
export type Create{Resource} = z.infer<typeof Create{Resource}Schema>;
export type Update{Resource} = z.infer<typeof Update{Resource}Schema>;
```

---

## Quick Reference Checklist

When adding a new resource API, create/modify the following files:

| Step | File       | Location                             |
| ---- | ---------- | ------------------------------------ |
| 1    | Endpoints  | `app/configs/endpoints.ts`           |
| 2    | Service    | `app/services/{resource}-service.ts` |
| 3    | Hooks      | `app/hooks/use-{resource}.ts`        |
| 4    | Zod Schema | `app/zod/{resource}.zod.ts`          |

---

## Notes

- Replace `{Resource}` with your resource name in **PascalCase** (e.g., `Order`, `Product`, `User`)
- Replace `{resource}` with your resource name in **camelCase** (e.g., `order`, `product`, `user`)
- Replace `RESOURCE` with your resource name in **UPPERCASE** (e.g., `ORDER`, `PRODUCT`, `USER`)
