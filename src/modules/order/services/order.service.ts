import { OrderItem } from "@/modules/order/types";

const mockOrders: OrderItem[] = [
  { id: "o_1", customer: "Sarah Khan", total: 149, status: "paid" },
  { id: "o_2", customer: "Alex Reed", total: 49, status: "pending" }
];

export const orderService = {
  async listOrders(): Promise<OrderItem[]> {
    return Promise.resolve(mockOrders);
  }
};
