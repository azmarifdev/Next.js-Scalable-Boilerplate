import { API_PREFIX } from "@/lib/constants";
import { UserListItem } from "@/modules/user/types";
import { apiClient, unwrapApiData } from "@/services/apiClient";
import { ApiResponse } from "@/types/api";

export const userService = {
  async listUsers(): Promise<UserListItem[]> {
    const { data } = await apiClient.get<ApiResponse<UserListItem[]>>(`${API_PREFIX}/users`);
    return unwrapApiData(data);
  }
};
