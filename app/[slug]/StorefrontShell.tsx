"use client";

import { useState, type ReactNode } from "react";
import type { Brand } from "@/lib/types";
import Cart from "@/components/storefront/Cart";
import { useCartStore } from "@/stores/cart";
import { ShoppingBag, Share2, BadgeCheck, Search, X } from "lucide-react";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import { StorefrontProvider, useStorefront } from "./StorefrontContext";
import { logEvent } from "@/lib/analytics";
import { useEffect } from "react";

interface StorefrontShellProps {
  brand: Brand;
  children: ReactNode;
}

function StorefrontHeader({ brand }: { brand: Brand }) {
  const { searchQuery, setSearchQuery } = useStorefront();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  
  const theme = brand.theme_settings || { theme: "light", primaryColor: "#000000", fontFamily: "Inter" };
  const isDark = theme.theme === "dark";

  useEffect(() => {
    logEvent(brand.id, 'page_view');
  }, [brand.id]);

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
      isDark ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {!isSearchOpen ? (
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden border ${
              isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
            }`}>
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(brand.name)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className={`font-bold uppercase tracking-tight text-sm sm:text-base truncate ${isDark ? "text-white" : "text-neutral-900"}`}>{brand.name}</h1>
                {brand.is_verified && <BadgeCheck size={16} className="text-primary mt-0.5 shrink-0" style={{ color: theme.primaryColor }} />}
              </div>
              {brand.bio && (
                <p className="text-[10px] text-muted truncate max-w-[150px] sm:max-w-xs h-4 uppercase tracking-widest">{brand.bio}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2 animate-fade-in">
            <Search size={18} className="text-muted shrink-0" />
            <input 
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none outline-none text-sm ${isDark ? "text-white" : "text-black"}`}
            />
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
              <X size={18} className="text-muted" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              }`}
            >
              <Search size={18} />
            </button>
          )}

          <button
            onClick={() => {
              // Custom event to open share toast or copy
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
            }`}
            title="Share store"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => {
              // This button is in the shell, but it needs to trigger the cart in the parent
              const event = new CustomEvent('open-cart');
              window.dispatchEvent(event);
            }}
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center`}
            style={{ 
              backgroundColor: itemCount > 0 ? theme.primaryColor : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
              color: itemCount > 0 ? '#000' : 'inherit'
            }}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-primary" style={{ borderColor: theme.primaryColor }}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function StorefrontShell({ brand, children }: StorefrontShellProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  // Listen for open-cart event
  useState(() => {
    if (typeof window !== 'undefined') {
      const handler = () => setIsCartOpen(true);
      window.addEventListener('open-cart', handler);
      return () => window.removeEventListener('open-cart', handler);
    }
  });

  const theme = brand.theme_settings || { theme: "light", primaryColor: "#000000", fontFamily: "Inter" };
  const isDark = theme.theme === "dark";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-neutral-50 text-black"}`}
      style={{ 
        fontFamily: `"${theme.fontFamily}", sans-serif`,
        // @ts-ignore
        "--primary-brand": theme.primaryColor 
      }}
    >
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`} />

      <StorefrontProvider>
        <StorefrontHeader brand={brand} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </main>

        <footer className={`border-t py-12 mt-20 ${isDark ? "border-white/5" : "border-black/5"}`}>
          <p className="text-center text-xs text-muted uppercase tracking-widest font-medium">
            Powered by{" "}
            <a href="/" className="text-foreground hover:opacity-70 transition-opacity font-bold">
              pòlówó Marketplace
            </a>
          </p>
        </footer>

        <Cart 
          brandId={brand.id} 
          brandName={brand.name} 
          whatsapp={brand.whatsapp || undefined}
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          primaryColor={theme.primaryColor}
          isDark={isDark}
          bankName={brand.bank_name}
          accountNumber={brand.account_number}
          accountName={brand.account_name}
        />
      </StorefrontProvider>
    </div>
  );
}
