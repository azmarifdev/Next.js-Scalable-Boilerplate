export interface OrderItem {
  id: string;
  customer: string;
  total: number;
  status: "pending" | "paid";
}
