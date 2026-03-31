import { ProductItem } from "@/modules/product/types";

const mockProducts: ProductItem[] = [
  { id: "p_1", name: "Starter Pack", price: 49, inStock: true },
  { id: "p_2", name: "Pro Pack", price: 99, inStock: true }
];

export const productService = {
  async listProducts(): Promise<ProductItem[]> {
    return Promise.resolve(mockProducts);
  }
};
