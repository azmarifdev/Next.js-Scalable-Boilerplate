import { API_PREFIX } from "@/lib/constants";
import { UserListItem } from "@/modules/user/types";
import { apiClient } from "@/services/apiClient";

export const userService = {
  async listUsers(): Promise<UserListItem[]> {
    return apiClient.get<UserListItem[]>(`${API_PREFIX}/users`);
  }
};
