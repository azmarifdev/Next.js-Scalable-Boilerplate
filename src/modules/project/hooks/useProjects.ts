"use client";

import { useQuery } from "@tanstack/react-query";

import { projectService } from "@/modules/project/services/project.service";

export function useProjects() {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.listProjects
  });

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError
  };
}
