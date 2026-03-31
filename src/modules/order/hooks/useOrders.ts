"use client";

import { useEffect, useState } from "react";

import { orderService } from "@/modules/order/services/order.service";
import { OrderItem } from "@/modules/order/types";

export function useOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      const response = await orderService.listOrders();
      setOrders(response);
    };

    void run();
  }, []);

  return { orders };
}
