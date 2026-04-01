export interface ProjectItem {
  id: string;
  name: string;
  owner: string;
  status: "planning" | "active" | "completed";
}
