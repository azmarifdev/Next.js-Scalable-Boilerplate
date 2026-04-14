import axios from "axios";

import { assertExternalApiBaseUrlConfigured, resolveApiEndpoint } from "@/lib/config/runtime";
import { ApiClientError } from "@/lib/errors/api-error";
import type { ApiResponse } from "@/types/api";

const restClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

function normalizeMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null) {
    const candidate = payload as {
      message?: string;
      error?: { message?: string } | null;
    };

    if (candidate.error?.message) {
      return candidate.error.message;
    }

    if (candidate.message) {
      return candidate.message;
    }
  }

  return fallback;
}

restClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const errorResponse = (error as { response?: { status?: number; data?: unknown } })?.response;
    const message = normalizeMessage(errorResponse?.data, "Unexpected API error");
    return Promise.reject(new ApiClientError(message, errorResponse?.status));
  }
);

export async function restGet<T>(path: string): Promise<ApiResponse<T>> {
  assertExternalApiBaseUrlConfigured();
  const endpoint = resolveApiEndpoint(path);
  const { data } = await restClient.get<ApiResponse<T>>(endpoint);
  return data;
}

export async function restPost<T, TPayload = unknown>(
  path: string,
  payload?: TPayload
): Promise<ApiResponse<T>> {
  assertExternalApiBaseUrlConfigured();
  const endpoint = resolveApiEndpoint(path);
  const { data } = await restClient.post<ApiResponse<T>>(endpoint, payload);
  return data;
}
