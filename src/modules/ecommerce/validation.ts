import { z } from "zod";

export const ecommerceFilterSchema = z.object({
  status: z.string().optional()
});
