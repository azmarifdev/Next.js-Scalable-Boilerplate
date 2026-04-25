import { API_PREFIX } from "@/lib/config/constants";
import { ProjectItem } from "@/modules/project/project.types";
import { apiClient } from "@/services/apiClient";

export const projectService = {
  async listProjects(): Promise<ProjectItem[]> {
    return apiClient.get<ProjectItem[]>(`${API_PREFIX}/projects`);
  }
};
