import { API_PREFIX } from "@/lib/config/constants";
import type { BillingSummary } from "@/modules/billing/billing.types";
import { apiClient } from "@/services/apiClient";

export const billingService = {
  async summary(): Promise<BillingSummary> {
    return apiClient.get<BillingSummary>(
      `${API_PREFIX}/billing/summary`,
      `
      query BillingSummary {
        billingSummary {
          activePlans
          mrr
        }
      }
      `
    );
  }
};
