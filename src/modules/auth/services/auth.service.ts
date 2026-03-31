import { API_PREFIX } from "@/lib/constants";
import { AuthPayload, AuthResponse } from "@/modules/auth/types";
import { apiClient } from "@/services/apiClient";
import { User } from "@/types/user";

export const authService = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(`${API_PREFIX}/auth/login`, payload);
    return data;
  },

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(`${API_PREFIX}/auth/register`, payload);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>(`${API_PREFIX}/auth/me`);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post(`${API_PREFIX}/auth/logout`);
  }
};
