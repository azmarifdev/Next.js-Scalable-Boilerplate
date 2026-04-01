import { TaskItem } from "@/modules/task/types";

const mockTasks: TaskItem[] = [
  {
    id: "t_1",
    title: "Prepare onboarding flow",
    assignee: "Ariyan",
    priority: "high",
    status: "in-progress"
  },
  {
    id: "t_2",
    title: "Audit route guards",
    assignee: "Nadia",
    priority: "medium",
    status: "todo"
  }
];

export const taskService = {
  async listTasks(): Promise<TaskItem[]> {
    return Promise.resolve(mockTasks);
  }
};
