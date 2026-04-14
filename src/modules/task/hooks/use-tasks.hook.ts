"use client";

import { useQuery } from "@tanstack/react-query";

import { taskService } from "@/modules/task/services/task.service";

export function useTasks() {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.listTasks
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError
  };
}
