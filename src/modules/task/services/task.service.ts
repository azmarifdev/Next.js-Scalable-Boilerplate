import { API_PREFIX } from "@/lib/constants";
import { TaskItem } from "@/modules/task/types";
import { apiClient } from "@/services/apiClient";

export const taskService = {
  async listTasks(): Promise<TaskItem[]> {
    return apiClient.get<TaskItem[]>(`${API_PREFIX}/tasks`);
  }
};
