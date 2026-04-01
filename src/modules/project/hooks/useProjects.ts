"use client";

import { useEffect, useState } from "react";

import { projectService } from "@/modules/project/services/project.service";
import { ProjectItem } from "@/modules/project/types";

export function useProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      const response = await projectService.listProjects();
      setProjects(response);
    };

    void run();
  }, []);

  return { projects };
}
