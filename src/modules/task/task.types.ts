export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
}
