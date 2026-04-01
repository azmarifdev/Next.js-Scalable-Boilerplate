"use client";

import { useEffect, useState } from "react";

import { taskService } from "@/modules/task/services/task.service";
import { TaskItem } from "@/modules/task/types";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      const response = await taskService.listTasks();
      setTasks(response);
    };

    void run();
  }, []);

  return { tasks };
}
