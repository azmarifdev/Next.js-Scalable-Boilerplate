import { appConfig } from "@/lib/config/app-config";
import { ApiClientError } from "@/lib/errors/api-error";
import { graphqlRequest } from "@/services/graphql/client";
import { restGet, restPost } from "@/services/rest/client";
import type { ApiResponse } from "@/types/api";

export function unwrapApiData<T>(payload: ApiResponse<T>): T {
  if (!payload.success) {
    const message = payload.error?.message ?? payload.message ?? "Unexpected API error";
    throw new ApiClientError(message, undefined, payload.error?.code);
  }

  if (payload.data === undefined || payload.data === null) {
    throw new ApiClientError(payload.message ?? "API response did not include data");
  }

  return payload.data;
}

export const apiClient = {
  async get<T>(path: string, graphqlQuery?: string): Promise<T> {
    if (appConfig.apiMode === "graphql" && graphqlQuery) {
      return graphqlRequest<T>(graphqlQuery);
    }

    const payload = await restGet<T>(path);
    return unwrapApiData(payload);
  },

  async post<T, TPayload = unknown>(
    path: string,
    body?: TPayload,
    graphqlQuery?: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    if (appConfig.apiMode === "graphql" && graphqlQuery) {
      return graphqlRequest<T>(graphqlQuery, variables);
    }

    const payload = await restPost<T, TPayload>(path, body);
    return unwrapApiData(payload);
  }
};
