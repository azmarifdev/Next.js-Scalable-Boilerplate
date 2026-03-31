import { CartItem } from "@/modules/cart/types";

const mockCart: CartItem[] = [{ id: "c_1", productId: "p_1", quantity: 2 }];

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    return Promise.resolve(mockCart);
  }
};
