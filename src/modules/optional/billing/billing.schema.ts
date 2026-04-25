import { z } from "zod";

export const billingFilterSchema = z.object({
  cycle: z.enum(["monthly", "yearly"]).optional()
});
