import { z } from "zod";

export const orderSchema = z.object({
  customer: z.string().min(2),
  total: z.number().min(0)
});
