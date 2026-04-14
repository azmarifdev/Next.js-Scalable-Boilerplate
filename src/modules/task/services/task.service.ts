import { API_PREFIX } from "@/lib/config/constants";
import { TaskItem } from "@/modules/task/task.types";
import { apiClient } from "@/services/apiClient";

export const taskService = {
  async listTasks(): Promise<TaskItem[]> {
    return apiClient.get<TaskItem[]>(
      `${API_PREFIX}/tasks`,
      `
      query Tasks {
        tasks {
          id
          title
          assignee
          priority
          status
        }
      }
      `
    );
  }
};
