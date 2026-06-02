"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/storefront/ProductGrid";
import ProductModal from "@/components/storefront/ProductModal";
import { logEvent } from "@/lib/analytics";

interface StorefrontContentProps {
  brand: any;
  products: Product[];
}

export default function StorefrontContent({ brand, products }: StorefrontContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const theme = brand.theme_settings || { theme: "light", primaryColor: "#000000", fontFamily: "Inter" };
  const isDark = theme.theme === "dark";

  return (
    <>
      <ProductGrid 
        products={products} 
        onProductClick={(p) => {
          setSelectedProduct(p);
          logEvent(brand.id, 'product_click', p.id);
        }} 
        primaryColor={theme.primaryColor}
        isDark={isDark}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          primaryColor={theme.primaryColor}
          isDark={isDark}
        />
      )}
    </>
  );
}
