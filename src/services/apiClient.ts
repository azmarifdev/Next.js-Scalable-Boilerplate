import axios from "axios";

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const envelope = error.response?.data as ApiResponse<unknown> | undefined;
    const message =
      envelope?.error?.message ?? error.response?.data?.message ?? "Unexpected API error";
    return Promise.reject(new Error(message));
  }
);

export function unwrapApiData<T>(payload: ApiResponse<T>): T {
  if (!payload.success || payload.data === null) {
    throw new Error(payload.error?.message ?? "Unexpected API error");
  }

  return payload.data;
}
