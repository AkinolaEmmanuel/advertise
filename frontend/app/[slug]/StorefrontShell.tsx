"use client";

import { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import type { Brand } from "@/lib/types";
import Cart from "@/components/storefront/Cart";
import { useCartStore } from "@/stores/cart";
import { ShoppingBag, Share2, BadgeCheck, Search, X } from "lucide-react";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import { StorefrontProvider, useStorefront } from "./StorefrontContext";
import { logEvent } from "@/lib/analytics";
import { hasCheckoutContact } from "@/lib/checkout-contact";
import PolowoLogo from "@/components/brand/PolowoLogo";

interface StorefrontShellProps {
  brand: Brand;
  children: ReactNode;
}

function StorefrontHeader({ brand }: { brand: Brand }) {
  const { searchQuery, setSearchQuery } = useStorefront();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  const theme = brand.theme_settings || { theme: "light", primaryColor: "#000000", fontFamily: "Inter" };

  useEffect(() => {
    logEvent(brand.id, "page_view");
  }, [brand.id]);

  const iconBtn =
    "p-2.5 rounded-xl border border-border bg-primary-soft hover:bg-surface-hover transition-all cursor-pointer";

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {!isSearchOpen ? (
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden border border-border bg-primary-soft">
              {brand.logo_url ? (
                <Image src={brand.logo_url} alt={brand.name} width={40} height={40} className="w-full h-full object-cover" />
              ) : (
                getInitials(brand.name)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold uppercase tracking-tight text-sm sm:text-base truncate text-foreground">
                  {brand.name}
                </h1>
                {brand.is_verified && (
                  <BadgeCheck size={16} className="shrink-0 mt-0.5" style={{ color: theme.primaryColor }} />
                )}
              </div>
              {brand.bio && (
                <p className="text-[10px] text-muted truncate max-w-[150px] sm:max-w-xs h-4 uppercase tracking-widest">
                  {brand.bio}
                </p>
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
              className="w-full bg-transparent border-none outline-none text-sm text-foreground"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-1 hover:bg-primary-soft rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} className="text-muted" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {!isSearchOpen && (
            <button onClick={() => setIsSearchOpen(true)} className={iconBtn}>
              <Search size={18} />
            </button>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className={iconBtn}
            title="Share store"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent("open-cart");
              window.dispatchEvent(event);
            }}
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              itemCount > 0 ? "" : "bg-primary-soft"
            }`}
            style={{
              backgroundColor: itemCount > 0 ? theme.primaryColor : undefined,
              color: itemCount > 0 ? "#000" : undefined,
            }}
          >
            <ShoppingBag size={18} className={itemCount > 0 ? "" : "text-foreground"} />
            {itemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2"
                style={{ borderColor: theme.primaryColor }}
              >
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
  const setActiveBrand = useCartStore((s) => s.setActiveBrand);

  useEffect(() => {
    setActiveBrand(brand.id);
  }, [brand.id, setActiveBrand]);

  useEffect(() => {
    const handler = () => setIsCartOpen(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  const theme = brand.theme_settings || { theme: "light", primaryColor: "#000000", fontFamily: "Inter" };
  const themeClass = theme.theme === "dark" ? "storefront-dark" : "storefront-light";

  const shellStyle = {
    fontFamily: `"${theme.fontFamily}", sans-serif`,
    "--primary-brand": theme.primaryColor,
  } as CSSProperties;

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-background text-foreground ${themeClass}`} style={shellStyle}>
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`}
      />

      <StorefrontProvider>
        <StorefrontHeader brand={brand} />

        <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>

        <footer className="border-t border-border py-12 mt-20">
          <p className="text-center text-xs text-muted uppercase tracking-widest font-medium flex items-center justify-center gap-2 flex-wrap">
            Powered by
            <PolowoLogo href="/" size="sm" />
          </p>
        </footer>

        <Cart
          brandId={brand.id}
          brandName={brand.name}
          whatsapp={brand.whatsapp || undefined}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          primaryColor={theme.primaryColor}
          bankName={brand.bank_name}
          accountNumber={brand.account_number}
          accountName={brand.account_name}
          checkoutReady={hasCheckoutContact(brand)}
        />
      </StorefrontProvider>
    </div>
  );
}
