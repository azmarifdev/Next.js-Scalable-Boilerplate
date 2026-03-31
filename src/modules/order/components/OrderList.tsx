"use client";

import { useOrders } from "@/modules/order/hooks/useOrders";

export function OrderList() {
  const { orders } = useOrders();

  return (
    <div className="stack">
      {orders.map((order) => (
        <div key={order.id} className="card">
          <p className="card-title text-title-xs">{order.customer}</p>
          <p className="help-text">${order.total.toFixed(2)}</p>
          <p className="badge">{order.status.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}
