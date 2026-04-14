"use client";

import { useQuery } from "@tanstack/react-query";

import { ecommerceService } from "@/modules/ecommerce/services/ecommerce.service";

export function useEcommerceSummary() {
  const query = useQuery({
    queryKey: ["ecommerce", "summary"],
    queryFn: ecommerceService.summary
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    isError: query.isError
  };
}
