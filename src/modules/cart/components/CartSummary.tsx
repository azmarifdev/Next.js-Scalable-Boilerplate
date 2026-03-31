"use client";

import { useCart } from "@/modules/cart/hooks/useCart";

export function CartSummary() {
  const { items } = useCart();

  return <p className="help-text">Cart items: {items.length}</p>;
}
