import { OrderList } from "@/modules/order/components/OrderList";

export default function OrdersPage() {
  return (
    <div className="stack">
      <h1 className="card-title">Orders</h1>
      <OrderList />
    </div>
  );
}
