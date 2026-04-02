import { API_PREFIX } from "@/lib/constants";
import { ProjectItem } from "@/modules/project/types";
import { apiClient, unwrapApiData } from "@/services/apiClient";
import { ApiResponse } from "@/types/api";

export const projectService = {
  async listProjects(): Promise<ProjectItem[]> {
    const { data } = await apiClient.get<ApiResponse<ProjectItem[]>>(`${API_PREFIX}/projects`);
    return unwrapApiData(data);
  }
};
