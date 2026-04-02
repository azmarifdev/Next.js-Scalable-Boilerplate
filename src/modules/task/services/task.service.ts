import { API_PREFIX } from "@/lib/constants";
import { TaskItem } from "@/modules/task/types";
import { apiClient, unwrapApiData } from "@/services/apiClient";
import { ApiResponse } from "@/types/api";

export const taskService = {
  async listTasks(): Promise<TaskItem[]> {
    const { data } = await apiClient.get<ApiResponse<TaskItem[]>>(`${API_PREFIX}/tasks`);
    return unwrapApiData(data);
  }
};
