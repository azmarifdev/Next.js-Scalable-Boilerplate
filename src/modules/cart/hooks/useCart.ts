"use client";

import { useEffect, useState } from "react";

import { cartService } from "@/modules/cart/services/cart.service";
import { CartItem } from "@/modules/cart/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      const response = await cartService.getCart();
      setItems(response);
    };

    void run();
  }, []);

  return { items };
}
