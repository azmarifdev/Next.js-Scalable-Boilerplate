import axios from "axios";

import { env } from "@/lib/env";

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
    const message = error.response?.data?.message ?? "Unexpected API error";
    return Promise.reject(new Error(message));
  }
);
