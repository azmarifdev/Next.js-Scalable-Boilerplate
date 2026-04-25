import { ApiClientError } from "@/lib/errors/api-error";
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
  async get<T>(path: string): Promise<T> {
    const payload = await restGet<T>(path);
    return unwrapApiData(payload);
  },

  async post<T, TPayload = unknown>(path: string, body?: TPayload): Promise<T> {
    const payload = await restPost<T, TPayload>(path, body);
    return unwrapApiData(payload);
  }
};
