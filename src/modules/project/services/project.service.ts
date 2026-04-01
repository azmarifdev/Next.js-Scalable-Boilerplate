import { ProjectItem } from "@/modules/project/types";

const mockProjects: ProjectItem[] = [
  { id: "pr_1", name: "Website Redesign", owner: "Sarah Khan", status: "active" },
  { id: "pr_2", name: "Analytics Revamp", owner: "Alex Reed", status: "planning" }
];

export const projectService = {
  async listProjects(): Promise<ProjectItem[]> {
    return Promise.resolve(mockProjects);
  }
};
