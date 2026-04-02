"use client";

import { useQuery } from "@tanstack/react-query";

import { billingService } from "@/modules/billing/services/billing.service";

export function useBillingSummary() {
  return useQuery({
    queryKey: ["billing", "summary"],
    queryFn: billingService.summary,
    enabled: false
  });
}
