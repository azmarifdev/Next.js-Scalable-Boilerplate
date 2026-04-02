import { assertFeatureEnabled } from "@/lib/config/feature-flags";
import type { BillingSummary } from "@/modules/billing/types";

export const billingService = {
  async summary(): Promise<BillingSummary> {
    assertFeatureEnabled("billing");
    return {
      activePlans: 0,
      mrr: 0
    };
  }
};
