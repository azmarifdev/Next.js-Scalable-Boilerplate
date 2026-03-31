import { CartSummary } from "@/modules/cart/components/CartSummary";
import { PaymentCard } from "@/modules/payment/components/PaymentCard";

export default function DashboardMainPage() {
  return (
    <div className="stack">
      <section className="card">
        <h1 className="card-title">Dashboard Overview</h1>
        <p className="card-subtitle">
          This layout is protected by middleware and uses modular feature slices.
        </p>
        <CartSummary />
      </section>
      <PaymentCard />
    </div>
  );
}
