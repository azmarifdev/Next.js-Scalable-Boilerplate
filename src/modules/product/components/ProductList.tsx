"use client";

import { useProducts } from "@/modules/product/hooks/useProducts";

export function ProductList() {
  const { products } = useProducts();

  return (
    <div className="grid-two">
      {products.map((product) => (
        <article key={product.id} className="card">
          <h3 className="card-title text-title-sm">{product.name}</h3>
          <p className="help-text">${product.price.toFixed(2)}</p>
          <span className="badge">{product.inStock ? "In stock" : "Out of stock"}</span>
        </article>
      ))}
    </div>
  );
}
