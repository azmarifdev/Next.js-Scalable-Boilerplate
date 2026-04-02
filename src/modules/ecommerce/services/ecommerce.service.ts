import { assertFeatureEnabled } from "@/lib/config/feature-flags";
import type { EcommerceSummary } from "@/modules/ecommerce/types";

export const ecommerceService = {
  async summary(): Promise<EcommerceSummary> {
    assertFeatureEnabled("ecommerce");
    return {
      orders: 0,
      revenue: 0
    };
  }
};
