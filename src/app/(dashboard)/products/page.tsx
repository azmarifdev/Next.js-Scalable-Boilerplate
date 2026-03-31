import { ProductList } from "@/modules/product/components/ProductList";

export default function ProductsPage() {
  return (
    <div className="stack">
      <h1 className="card-title">Products</h1>
      <ProductList />
    </div>
  );
}
