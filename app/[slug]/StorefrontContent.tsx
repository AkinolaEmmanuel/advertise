"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/storefront/ProductGrid";
import ProductModal from "@/components/storefront/ProductModal";

interface StorefrontContentProps {
  products: Product[];
}

export default function StorefrontContent({ products }: StorefrontContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <ProductGrid products={products} onProductClick={setSelectedProduct} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
