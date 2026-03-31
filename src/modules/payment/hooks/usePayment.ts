"use client";

import { useState } from "react";

import { paymentService } from "@/modules/payment/services/payment.service";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);

  async function createIntent(amount: number): Promise<string> {
    setIsLoading(true);
    try {
      const response = await paymentService.createIntent(amount);
      return response.clientSecret;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, createIntent };
}
