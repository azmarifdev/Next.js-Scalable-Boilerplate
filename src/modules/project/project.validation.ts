import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2),
  owner: z.string().min(2),
  status: z.enum(["planning", "active", "completed"])
});
