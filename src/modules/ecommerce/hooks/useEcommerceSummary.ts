"use client";

import { useQuery } from "@tanstack/react-query";

import { ecommerceService } from "@/modules/ecommerce/services/ecommerce.service";

export function useEcommerceSummary() {
  return useQuery({
    queryKey: ["ecommerce", "summary"],
    queryFn: ecommerceService.summary,
    enabled: false
  });
}
