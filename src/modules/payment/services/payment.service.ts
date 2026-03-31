import { API_PREFIX } from "@/lib/constants";
import { PaymentIntentResponse } from "@/modules/payment/types";
import { apiClient } from "@/services/apiClient";

export const paymentService = {
  async createIntent(amount: number): Promise<PaymentIntentResponse> {
    const { data } = await apiClient.post<PaymentIntentResponse>(`${API_PREFIX}/stripe/create-intent`, {
      amount
    });
    return data;
  }
};
