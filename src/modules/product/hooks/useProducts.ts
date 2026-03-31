"use client";

import { useEffect, useState } from "react";

import { productService } from "@/modules/product/services/product.service";
import { ProductItem } from "@/modules/product/types";

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      const response = await productService.listProducts();
      setProducts(response);
    };

    void run();
  }, []);

  return { products };
}
