"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useStorefront } from "@/app/[slug]/StorefrontContext";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  primaryColor?: string;
}

function isOutOfStock(product: Product): boolean {
  return product.quantity >= 0 && product.quantity === 0;
}

export default function ProductGrid({ products, onProductClick, primaryColor }: ProductGridProps) {
  const { searchQuery } = useStorefront();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-primary-soft">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
            <path d="m7.5 4.27 9 5.15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3.3 7 8.7 5 8.7-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1 text-foreground">No products yet</h3>
        <p className="text-muted text-sm max-w-xs mx-auto">This pòlówó is being set up by the curator. Please check back later.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary-soft">
          <Search size={28} className="text-muted" />
        </div>
        <h3 className="text-lg font-bold mb-1 text-foreground">No results found</h3>
        <p className="text-muted text-sm flex items-center gap-1">
          No matches for <span className="text-foreground font-medium italic">&ldquo;{searchQuery}&rdquo;</span>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {filteredProducts.map((product, index) => {
        const outOfStock = isOutOfStock(product);
        return (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`group relative text-left border border-border bg-surface rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-fade-in shadow-lg ${
              outOfStock ? "opacity-75" : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            />
            <div className="relative aspect-square overflow-hidden bg-surface-hover">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${outOfStock ? "grayscale" : ""}`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
              {outOfStock && (
                <div className="absolute inset-0 bg-overlay/40 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-md">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5">
              <h3 className="font-medium text-sm truncate text-foreground/80">{product.name}</h3>
              <p className="font-bold mt-1.5 text-lg text-foreground">{formatPrice(product.price)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
