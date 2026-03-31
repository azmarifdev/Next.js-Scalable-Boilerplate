"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePayment } from "@/modules/payment/hooks/usePayment";

export function PaymentCard() {
  const { isLoading, createIntent } = usePayment();
  const [clientSecret, setClientSecret] = useState<string>("");

  async function handleClick(): Promise<void> {
    const secret = await createIntent(1500);
    setClientSecret(secret);
  }

  return (
    <div className="card">
      <h3 className="card-title text-title-sm">Payment setup</h3>
      <p className="help-text">Create a fake Stripe intent through the service layer.</p>
      <Button onClick={handleClick} className="mt-3" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Intent"}
      </Button>
      {clientSecret ? <p className="badge badge-block mt-2">{clientSecret}</p> : null}
    </div>
  );
}
