import type { Product } from "./types";

/** Returns max purchasable quantity, or null when unlimited. */
export function getStockLimit(product: Product): number | null {
  if (product.quantity < 0) return null;
  return product.quantity;
}

export function canIncreaseQuantity(product: Product, currentQty: number): boolean {
  const limit = getStockLimit(product);
  if (limit === null) return true;
  return currentQty < limit;
}
