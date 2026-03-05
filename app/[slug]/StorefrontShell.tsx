"use client";

import { useState, type ReactNode } from "react";
import type { Brand } from "@/lib/types";
import Cart from "@/components/storefront/Cart";
import { useCartStore } from "@/stores/cart";
import { ShoppingBag } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface StorefrontShellProps {
  brand: Brand;
  children: ReactNode;
}

export default function StorefrontShell({ brand, children }: StorefrontShellProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0 overflow-hidden">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(brand.name)
              )}
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base">{brand.name}</h1>
              {brand.bio && (
                <p className="text-xs text-muted truncate max-w-[200px] sm:max-w-xs">{brand.bio}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-border transition-colors cursor-pointer"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <p className="text-center text-xs text-muted">
          Powered by{" "}
          <a href="/" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Advertise
          </a>
        </p>
      </footer>

      <Cart brand={brand} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
