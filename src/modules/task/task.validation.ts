import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2),
  assignee: z.string().min(2),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "done"])
});
