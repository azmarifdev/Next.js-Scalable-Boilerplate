import { API_PREFIX } from "@/lib/config/constants";
import type { EcommerceSummary } from "@/modules/ecommerce/ecommerce.types";
import { apiClient } from "@/services/apiClient";

export const ecommerceService = {
  async summary(): Promise<EcommerceSummary> {
    return apiClient.get<EcommerceSummary>(`${API_PREFIX}/ecommerce/summary`);
  }
};
