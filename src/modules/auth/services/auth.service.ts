import { API_PREFIX } from "@/lib/constants";
import { AuthPayload, AuthResponse } from "@/modules/auth/types";
import { apiClient, unwrapApiData } from "@/services/apiClient";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

export const authService = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      `${API_PREFIX}/auth/login`,
      payload
    );
    return unwrapApiData(data);
  },

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      `${API_PREFIX}/auth/register`,
      payload
    );
    return unwrapApiData(data);
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(`${API_PREFIX}/auth/me`);
    return unwrapApiData(data);
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<{ cleared: boolean }>>(`${API_PREFIX}/auth/logout`);
  }
};
