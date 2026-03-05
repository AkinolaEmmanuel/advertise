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
  isDark: boolean;
}

function isOutOfStock(product: Product): boolean {
  return product.quantity >= 0 && product.quantity === 0;
}

export default function ProductGrid({ products, onProductClick, primaryColor, isDark }: ProductGridProps) {
  const { searchQuery } = useStorefront();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
            <path d="m7.5 4.27 9 5.15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3.3 7 8.7 5 8.7-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-black"}`}>No products yet</h3>
        <p className="text-muted text-sm max-w-xs mx-auto">This pòlówó is being set up by the curator. Please check back later.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
          <Search size={28} className="text-muted" />
        </div>
        <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-black"}`}>No results found</h3>
        <p className="text-muted text-sm flex items-center gap-1">
          No matches for <span className="text-white font-medium italic">"{searchQuery}"</span>
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
            className={`group text-left border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer animate-fade-in ${
              isDark ? "bg-white/[0.02] border-white/5 shadow-2xl shadow-black" : "bg-white border-black/[0.03] shadow-lg"
            } ${outOfStock ? "opacity-75" : ""}`}
            style={{ 
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div 
              className="absolute inset-x-0 bottom-0 h-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            />
            <div className={`relative aspect-square overflow-hidden ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`}>
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
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white text-black px-2.5 py-1 rounded-md">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
 
            <div className="p-4 sm:p-5">
              <h3 className={`font-medium text-sm truncate ${isDark ? "text-white/80" : "text-black/80"}`}>{product.name}</h3>
              <p className={`font-bold mt-1.5 text-lg ${isDark ? "text-white" : "text-black"}`}>{formatPrice(product.price)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
