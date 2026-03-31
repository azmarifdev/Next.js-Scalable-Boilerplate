import { z } from "zod";

export const userFilterSchema = z.object({
  search: z.string().optional()
});
