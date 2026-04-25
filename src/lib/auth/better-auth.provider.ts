import { API_PREFIX } from "@/lib/config/constants";
import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import { apiClient } from "@/services/apiClient";
import type { User } from "@/types/user";

export const betterAuthProvider = {
  login(payload: AuthPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, AuthPayload>(`${API_PREFIX}/auth/login`, payload);
  },

  register(payload: AuthPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, AuthPayload>(`${API_PREFIX}/auth/register`, payload);
  },

  getMe(): Promise<User> {
    return apiClient.get<User>(`${API_PREFIX}/auth/me`);
  },

  logout(): Promise<{ cleared: boolean }> {
    return apiClient.post<{ cleared: boolean }>(`${API_PREFIX}/auth/logout`);
  },

  refreshToken(): Promise<{ refreshed: boolean }> {
    return apiClient.post<{ refreshed: boolean }>(`${API_PREFIX}/auth/refresh`);
  }
};
